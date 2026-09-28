package com.water.waterbilling.service;

import com.water.waterbilling.config.GeminiConfig;
import com.water.waterbilling.dto.ChatRequest;
import com.water.waterbilling.dto.ChatResponse;
import com.water.waterbilling.entity.*;
import com.water.waterbilling.repository.*;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
public class ChatService {

    private final UserRepository userRepository;
    private final InvoiceRepository invoiceRepository;
    private final TicketRepository ticketRepository;
    private final WaterUsageRepository waterUsageRepository;
    private final ApartmentRepository apartmentRepository;
    private final TariffPlanRepository tariffPlanRepository;
    private final WaterPurchaseRepository waterPurchaseRepository;
    private final BillingCycleRepository billingCycleRepository;

    private final RestTemplate restTemplate;
    private final GeminiConfig geminiConfig;

    public ChatService(
            UserRepository userRepository,
            InvoiceRepository invoiceRepository,
            TicketRepository ticketRepository,
            WaterUsageRepository waterUsageRepository,
            ApartmentRepository apartmentRepository,
            TariffPlanRepository tariffPlanRepository,
            WaterPurchaseRepository waterPurchaseRepository,
            BillingCycleRepository billingCycleRepository,
            RestTemplate restTemplate,
            GeminiConfig geminiConfig
    ) {
        this.userRepository = userRepository;
        this.invoiceRepository = invoiceRepository;
        this.ticketRepository = ticketRepository;
        this.waterUsageRepository = waterUsageRepository;
        this.apartmentRepository = apartmentRepository;
        this.tariffPlanRepository = tariffPlanRepository;
        this.waterPurchaseRepository = waterPurchaseRepository;
        this.billingCycleRepository = billingCycleRepository;
        this.restTemplate = restTemplate;
        this.geminiConfig = geminiConfig;
    }

    // ============================================================
    // MAIN CHAT METHOD
    // ============================================================

    public ChatResponse chat(ChatRequest request, String username) {

        String message = request != null && request.getMessage() != null
                ? request.getMessage().trim() : "";

        String currentPage = request != null && request.getCurrentPage() != null
                ? request.getCurrentPage() : "/";

        List<Map<String, String>> history = request != null && request.getHistory() != null
                ? request.getHistory() : Collections.emptyList();

        User user = userRepository.findByUsername(username).orElse(null);
        String role = user != null ? user.getRole() : "ANONYMOUS";
        String intent = detectIntent(message);

        Map<String, Object> liveData = new HashMap<>();
        String context = buildRoleContextPrompt(user, role, liveData);
        String systemPrompt = buildSystemPrompt(role, context, currentPage, intent);
        String response = callGeminiAPI(systemPrompt, message, history);
        String navigation = resolveNavigation(message, role, currentPage);
        List<String> suggestions = generateSuggestions(message, role, intent);

        return new ChatResponse(cleanMarkdown(response), suggestions, navigation, liveData);
    }

    // ============================================================
    // GEMINI API CALL
    // ============================================================

    private String callGeminiAPI(String systemPrompt, String userMessage, List<Map<String, String>> history) {
        try {
            String url = geminiConfig.getApiUrl() + "?key=" + geminiConfig.getApiKey();

            List<Map<String, Object>> contents = new ArrayList<>();

            if (history != null) {
                for (Map<String, String> item : history) {
                    String text = item.get("text");
                    if (text == null || text.isBlank()) continue;

                    String role = "USER".equalsIgnoreCase(item.get("sender")) ? "user" : "model";

                    contents.add(Map.of(
                            "role", role,
                            "parts", List.of(Map.of("text", text))
                    ));
                }
            }

            String finalPrompt = systemPrompt + "\n\nUser Question:\n" + userMessage;

            contents.add(Map.of(
                    "role", "user",
                    "parts", List.of(Map.of("text", finalPrompt))
            ));

            Map<String, Object> body = Map.of("contents", contents);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getBody() != null) {
                List candidates = (List) response.getBody().get("candidates");

                if (candidates != null && !candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map content = (Map) candidate.get("content");
                    List parts = (List) content.get("parts");
                    Map first = (Map) parts.get(0);
                    return first.get("text").toString();
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            return """
    AI service is temporarily unavailable.

    I can still help you with:
    - Current bill
    - Water usage
    - Invoice details
    - Ticket status

    Please try again after some time.
    """;
        }

        return "I could not process your request. Please try again.";
    }

    // ============================================================
    // SHARED HELPERS
    // ============================================================

    private Apartment resolveApartment(String apartmentName) {
        if (apartmentName == null) return null;
        return apartmentRepository.findByApartmentName(apartmentName).orElse(null);
    }

    private double sumUsageInRange(List<WaterUsageEntry> entries, LocalDate start, LocalDate end) {
        return entries.stream()
                .filter(e -> !e.getDate().isBefore(start) && !e.getDate().isAfter(end))
                .mapToDouble(WaterUsageEntry::getLitresUsed)
                .sum();
    }

    private double sumUsageOnDate(List<WaterUsageEntry> entries, LocalDate date) {
        return entries.stream()
                .filter(e -> e.getDate().equals(date))
                .mapToDouble(WaterUsageEntry::getLitresUsed)
                .sum();
    }

    // ============================================================
    // RESIDENT CONTEXT
    // ============================================================

    private void collectResidentData(User resident, StringBuilder sb, Map<String, Object> liveData) {

        sb.append("\n=== RESIDENT CONTEXT ===\n");
        sb.append("Username: " + resident.getUsername() + "\n");
        sb.append("Apartment: " + resident.getApartment() + "\n");
        sb.append("Flat Number: " + resident.getFlatNumber() + "\n");

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDate lastMonthStart = today.minusMonths(1).withDayOfMonth(1);
        LocalDate lastMonthEnd = lastMonthStart.withDayOfMonth(lastMonthStart.lengthOfMonth());

        // ================= TODAY'S USAGE =================

        Optional<WaterUsageEntry> todayEntry =
                waterUsageRepository.findByUsernameAndDate(resident.getUsername(), today);

        if (todayEntry.isPresent()) {
            sb.append(String.format("Today's Usage: %.2f Litres\n", todayEntry.get().getLitresUsed()));
            liveData.put("todayUsage", todayEntry.get().getLitresUsed());
        } else {
            sb.append("Today's Usage: Not logged yet by Community Admin.\n");
        }

        // ================= YESTERDAY & LAST MONTH =================

        Optional<WaterUsageEntry> yesterdayEntry =
                waterUsageRepository.findByUsernameAndDate(resident.getUsername(), yesterday);

        sb.append("Yesterday's Usage: ");
        sb.append(yesterdayEntry.map(e -> String.format("%.2f Litres\n", e.getLitresUsed()))
                .orElse("Not logged.\n"));

        List<WaterUsageEntry> lastMonthEntries = waterUsageRepository
                .findByUsernameAndDateBetween(resident.getUsername(), lastMonthStart, lastMonthEnd);
        double lastMonthUsage = lastMonthEntries.stream().mapToDouble(WaterUsageEntry::getLitresUsed).sum();
        sb.append(String.format("Last Month's Total Usage (%s %d): %.2f Litres\n",
                lastMonthStart.getMonth(), lastMonthStart.getYear(), lastMonthUsage));

        // ================= OVERALL USAGE =================

        List<WaterUsageEntry> usage = waterUsageRepository.findByUsernameOrderByDateAsc(resident.getUsername());

        if (!usage.isEmpty()) {
            double total = usage.stream().mapToDouble(WaterUsageEntry::getLitresUsed).sum();
            WaterUsageEntry latest = usage.get(usage.size() - 1);

            sb.append(String.format("Total Recorded Usage (all time): %.2f Litres\n", total));
            sb.append(String.format("Latest Logged Usage: %.2f Litres on %s\n", latest.getLitresUsed(), latest.getDate()));

            liveData.put("totalUsage", total);
            liveData.put("latestUsage", latest.getLitresUsed());
        } else {
            sb.append("No usage records found.\n");
        }

        // ================= APARTMENT / TARIFF / BILLING CYCLE =================

        Apartment apartment = resolveApartment(resident.getApartment());

        if (apartment != null) {

            TariffPlan tariff = tariffPlanRepository.findByApartment(apartment).orElse(null);

            if (tariff != null) {
                sb.append("\n--- Tariff Rate (your community) ---\n");
                sb.append(String.format("Tier 1: up to %.0f Litres at ₹%.2f/Litre\n",
                        tariff.getTier1ThresholdLitres(), tariff.getTier1RateInr()));
                sb.append(String.format("Tier 2: above %.0f Litres at ₹%.2f/Litre\n",
                        tariff.getTier1ThresholdLitres(), tariff.getTier2RateInr()));
                sb.append(String.format("Daily Usage Alert Threshold: %.0f Litres\n",
                        tariff.getDailyAlertThresholdLitres()));
            } else {
                sb.append("\nTariff Rate: Not configured yet by your Community Admin.\n");
            }

            List<BillingCycle> cycles = billingCycleRepository.findByApartmentOrderByStartDateDesc(apartment);
            BillingCycle currentCycle = cycles.stream()
                    .filter(c -> "OPEN".equalsIgnoreCase(c.getStatus()))
                    .findFirst()
                    .orElse(cycles.isEmpty() ? null : cycles.get(0));

            if (currentCycle != null) {
                sb.append("\n--- Current Billing Cycle ---\n");
                sb.append("Period: " + currentCycle.getPeriodLabel() + "\n");
                sb.append("Status: " + currentCycle.getStatus() + "\n");
                sb.append("Dates: " + currentCycle.getStartDate() + " to " + currentCycle.getEndDate() + "\n");

                liveData.put("currentCyclePeriod", currentCycle.getPeriodLabel());
                liveData.put("currentCycleStatus", currentCycle.getStatus());
            } else {
                sb.append("\nNo billing cycle has been created yet for your community.\n");
            }
        } else {
            sb.append("\nApartment record not found — tariff and billing cycle info unavailable.\n");
        }

        // ================= INVOICES (recent history) =================

        List<Invoice> invoices = invoiceRepository.findByResidentUsernameOrderByIdDesc(resident.getUsername());

        if (!invoices.isEmpty()) {
            Invoice latest = invoices.get(0);

            sb.append("\n--- Latest Invoice ---\n");
            sb.append("Invoice ID: " + latest.getId() + "\n");
            sb.append(String.format("Litres Used: %.2f\n", latest.getLitresUsed()));
            sb.append(String.format("Base Charge: ₹%.2f\n", latest.getBaseChargeInr()));
            sb.append(String.format("Shared Allocation: ₹%.2f\n", latest.getSharedAreaAllocationInr()));
            sb.append(String.format("Adjustment: ₹%.2f", latest.getAdjustmentInr()));
            if (latest.getAdjustmentReason() != null && !latest.getAdjustmentReason().isBlank()) {
                sb.append(" (" + latest.getAdjustmentReason() + ")");
            }
            sb.append("\n");
            sb.append(String.format("Total Payable: ₹%.2f\n", latest.getTotalInr()));

            liveData.put("currentBill", latest.getTotalInr());

            if (invoices.size() > 1) {
                sb.append("\n--- Previous Invoices ---\n");
                int shown = 0;
                for (int i = 1; i < invoices.size() && shown < 3; i++, shown++) {
                    Invoice inv = invoices.get(i);
                    sb.append(String.format("Invoice #%d — %.2f Litres — ₹%.2f\n",
                            inv.getId(), inv.getLitresUsed(), inv.getTotalInr()));
                }
            }

            // last month's specific bill, if a cycle exists for it
            invoices.stream()
                    .filter(inv -> inv.getBillingCycle() != null
                            && inv.getBillingCycle().getStartDate() != null
                            && inv.getBillingCycle().getStartDate().getMonthValue() == lastMonthStart.getMonthValue()
                            && inv.getBillingCycle().getStartDate().getYear() == lastMonthStart.getYear())
                    .findFirst()
                    .ifPresentOrElse(
                            inv -> sb.append(String.format("\nLast Month's Bill: ₹%.2f (%.2f Litres)\n",
                                    inv.getTotalInr(), inv.getLitresUsed())),
                            () -> sb.append("\nLast Month's Bill: No invoice found for last month.\n")
                    );

        } else {
            sb.append("\nNo invoices available yet.\n");
        }

        // ================= TICKETS =================

        try {
            List<Ticket> tickets = ticketRepository.findByUsernameOrderByCreatedAtDesc(resident.getUsername());

            sb.append("\n--- Support Tickets ---\n");
            sb.append("Total Tickets Raised: " + tickets.size() + "\n");

            int shown = 0;
            for (Ticket t : tickets) {
                if (shown >= 3) break;
                sb.append(String.format("Ticket #%d — %s — Status: %s\n", t.getId(), t.getSubject(), t.getStatus()));
                shown++;
            }

        } catch (Exception e) {
            sb.append("\nTicket information unavailable.\n");
        }
    }

    // ============================================================
    // COMMUNITY ADMIN CONTEXT
    // ============================================================

    private void collectCommunityAdminData(User admin, StringBuilder sb, Map<String, Object> liveData) {

        sb.append("\n=== COMMUNITY ADMIN CONTEXT ===\n");

        Apartment apartment = apartmentRepository.findByCommunityAdmin(admin).orElse(null);

        if (apartment == null) {
            sb.append("No community assigned.\n");
            return;
        }

        String apartmentName = apartment.getApartmentName();
        sb.append("Community Name: " + apartmentName + "\n");
        sb.append("Total Flats Registered: " + apartment.getTotalFlats() + "\n");

        // ================= RESIDENTS =================

        List<User> residents = userRepository.findByApartmentAndRole(apartmentName, "RESIDENT");
        sb.append("Total Residents: " + residents.size() + "\n");
        liveData.put("residentCount", residents.size());

        List<String> usernames = residents.stream().map(User::getUsername).toList();
        List<WaterUsageEntry> allEntries = waterUsageRepository.findByUsernameInOrderByDateAsc(usernames);

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDate lastMonthStart = today.minusMonths(1).withDayOfMonth(1);
        LocalDate lastMonthEnd = lastMonthStart.withDayOfMonth(lastMonthStart.lengthOfMonth());

        // ================= TODAY'S COMMUNITY USAGE =================

        double todayUsage = sumUsageOnDate(allEntries, today);
        sb.append(String.format("Today's Community Usage: %.2f Litres\n", todayUsage));
        liveData.put("todayCommunityUsage", todayUsage);

        // ================= YESTERDAY & LAST MONTH (COMMUNITY) =================

        double yesterdayUsage = sumUsageOnDate(allEntries, yesterday);
        double lastMonthUsage = sumUsageInRange(allEntries, lastMonthStart, lastMonthEnd);

        sb.append(String.format("Yesterday's Community Usage: %.2f Litres\n", yesterdayUsage));
        sb.append(String.format("Last Month's Community Usage (%s %d): %.2f Litres\n",
                lastMonthStart.getMonth(), lastMonthStart.getYear(), lastMonthUsage));

        liveData.put("yesterdayCommunityUsage", yesterdayUsage);
        liveData.put("lastMonthCommunityUsage", lastMonthUsage);

        // ================= TARIFF =================

        TariffPlan tariff = tariffPlanRepository.findByApartment(apartment).orElse(null);

        if (tariff != null) {
            sb.append("\n--- Tariff Configuration ---\n");
            sb.append(String.format("Tier 1 Limit: %.0f Litres\n", tariff.getTier1ThresholdLitres()));
            sb.append(String.format("Tier 1 Rate: ₹%.2f/Litre\n", tariff.getTier1RateInr()));
            sb.append(String.format("Tier 2 Rate: ₹%.2f/Litre\n", tariff.getTier2RateInr()));
            sb.append(String.format("Daily Alert Threshold: %.0f Litres\n", tariff.getDailyAlertThresholdLitres()));
        } else {
            sb.append("\nTariff Configuration: Not set up yet.\n");
        }

        // ================= BILLING CYCLES =================

        List<BillingCycle> cycles = billingCycleRepository.findByApartmentOrderByStartDateDesc(apartment);
        sb.append("\n--- Billing Cycles ---\n");
        sb.append("Total Billing Cycles Created: " + cycles.size() + "\n");

        BillingCycle currentCycle = cycles.stream()
                .filter(c -> "OPEN".equalsIgnoreCase(c.getStatus()))
                .findFirst()
                .orElse(null);

        if (currentCycle != null) {
            sb.append("Active Cycle: " + currentCycle.getPeriodLabel()
                    + " (" + currentCycle.getStartDate() + " to " + currentCycle.getEndDate() + ")\n");
            liveData.put("activeCyclePeriod", currentCycle.getPeriodLabel());
        } else {
            sb.append("No cycle is currently OPEN. Most recent cycle status: "
                    + (cycles.isEmpty() ? "none created" : cycles.get(0).getStatus()) + "\n");
        }

        // last month's specific billing cycle total
        cycles.stream()
                .filter(c -> c.getStartDate() != null
                        && c.getStartDate().getMonthValue() == lastMonthStart.getMonthValue()
                        && c.getStartDate().getYear() == lastMonthStart.getYear())
                .findFirst()
                .ifPresentOrElse(
                        c -> {
                            List<Invoice> cycleInvoices = invoiceRepository.findByBillingCycleOrderByResidentFullNameAsc(c);
                            double cycleTotal = cycleInvoices.stream().mapToDouble(Invoice::getTotalInr).sum();
                            sb.append(String.format("Last Month's Total Billed (%s): ₹%.2f\n", c.getPeriodLabel(), cycleTotal));
                        },
                        () -> sb.append("Last Month's Total Billed: No billing cycle found for last month.\n")
                );

        // ================= WATER PURCHASES =================

        List<WaterPurchase> purchases = waterPurchaseRepository.findByApartmentOrderByPurchaseDateDesc(apartment);
        double totalCost = purchases.stream().mapToDouble(WaterPurchase::getTotalCostInr).sum();

        sb.append(String.format("\nWater Purchases Logged: %d | Total Cost ₹%.2f\n", purchases.size(), totalCost));
        liveData.put("waterPurchaseCount", purchases.size());
        liveData.put("waterPurchaseTotalCost", totalCost);

        double lastMonthPurchaseCost = purchases.stream()
                .filter(p -> !p.getPurchaseDate().isBefore(lastMonthStart) && !p.getPurchaseDate().isAfter(lastMonthEnd))
                .mapToDouble(WaterPurchase::getTotalCostInr)
                .sum();
        sb.append(String.format("Last Month's Water Purchase Cost: ₹%.2f\n", lastMonthPurchaseCost));

        // ================= TICKETS (assigned to this community admin) =================

        try {
            List<Ticket> tickets = ticketRepository.findByApartmentAndTargetRoleOrderByCreatedAtDesc(
                    apartmentName, Ticket.TargetRole.COMMUNITY_ADMIN);

            long open = tickets.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.OPEN).count();
            long inProgress = tickets.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.IN_PROGRESS).count();
            long resolved = tickets.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.RESOLVED).count();
            long escalated = tickets.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.ESCALATED).count();

            sb.append("\n--- Support Tickets (your community) ---\n");
            sb.append("Open: " + open + " | In Progress: " + inProgress
                    + " | Resolved: " + resolved + " | Escalated: " + escalated + "\n");

            liveData.put("openTickets", open);
            liveData.put("pendingTickets", open + inProgress);

        } catch (Exception e) {
            sb.append("\nTicket information unavailable.\n");
        }
    }

    // ============================================================
    // SUPER ADMIN CONTEXT
    // ============================================================

    private void collectSuperAdminData(User admin, StringBuilder sb, Map<String, Object> liveData) {

        sb.append("\n=== SUPER ADMIN CONTEXT ===\n");

        List<User> users = userRepository.findAll();

        long residents = users.stream().filter(u -> "RESIDENT".equals(u.getRole())).count();
        long communityAdmins = users.stream().filter(u -> "COMMUNITY_ADMIN".equals(u.getRole())).count();
        long pendingApprovals = users.stream()
                .filter(u -> "COMMUNITY_ADMIN".equals(u.getRole()) && !Boolean.TRUE.equals(u.getApproved()))
                .count();

        List<Apartment> apartments = apartmentRepository.findAll();

        sb.append("Total Users: " + users.size() + "\n");
        sb.append("Residents: " + residents + "\n");
        sb.append("Community Admins: " + communityAdmins + "\n");
        sb.append("Community Admins Pending Approval: " + pendingApprovals + "\n");
        sb.append("Total Communities: " + apartments.size() + "\n");

        liveData.put("totalUsers", users.size());
        liveData.put("totalCommunities", apartments.size());
        liveData.put("pendingApprovals", pendingApprovals);

        LocalDate today = LocalDate.now();
        LocalDate lastMonthStart = today.minusMonths(1).withDayOfMonth(1);
        LocalDate lastMonthEnd = lastMonthStart.withDayOfMonth(lastMonthStart.lengthOfMonth());

        // ================= PLATFORM-WIDE BILLING =================

        List<Invoice> allInvoices = invoiceRepository.findAll();
        double totalRevenue = allInvoices.stream().mapToDouble(Invoice::getTotalInr).sum();

        sb.append("\n--- Platform Billing ---\n");
        sb.append("Total Invoices Generated: " + allInvoices.size() + "\n");
        sb.append(String.format("Total Billed Across Platform: ₹%.2f\n", totalRevenue));
        liveData.put("totalRevenue", totalRevenue);

        double lastMonthRevenue = allInvoices.stream()
                .filter(inv -> inv.getBillingCycle() != null
                        && inv.getBillingCycle().getStartDate() != null
                        && inv.getBillingCycle().getStartDate().getMonthValue() == lastMonthStart.getMonthValue()
                        && inv.getBillingCycle().getStartDate().getYear() == lastMonthStart.getYear())
                .mapToDouble(Invoice::getTotalInr)
                .sum();
        sb.append(String.format("Last Month's Platform Revenue: ₹%.2f\n", lastMonthRevenue));

        // ================= PLATFORM-WIDE WATER PURCHASES =================

        List<WaterPurchase> allPurchases = waterPurchaseRepository.findAll();
        double totalPurchaseCost = allPurchases.stream().mapToDouble(WaterPurchase::getTotalCostInr).sum();

        sb.append(String.format("Total Water Purchase Cost (all communities): ₹%.2f\n", totalPurchaseCost));

        double lastMonthPurchaseCost = allPurchases.stream()
                .filter(p -> !p.getPurchaseDate().isBefore(lastMonthStart) && !p.getPurchaseDate().isAfter(lastMonthEnd))
                .mapToDouble(WaterPurchase::getTotalCostInr)
                .sum();
        sb.append(String.format("Last Month's Platform Water Purchase Cost: ₹%.2f\n", lastMonthPurchaseCost));

        // ================= TICKET QUEUE (system bugs + escalated) =================

        try {
            List<Ticket> tickets = ticketRepository.findByTargetRoleOrderByCreatedAtDesc(Ticket.TargetRole.SUPER_ADMIN);

            long open = tickets.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.OPEN).count();
            long escalated = tickets.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.ESCALATED).count();
            long resolved = tickets.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.RESOLVED).count();

            sb.append("\n--- Super Admin Ticket Queue ---\n");
            sb.append("Total in Queue: " + tickets.size() + "\n");
            sb.append("Open: " + open + " | Escalated: " + escalated + " | Resolved: " + resolved + "\n");

            liveData.put("superAdminOpenTickets", open);
            liveData.put("superAdminEscalatedTickets", escalated);

        } catch (Exception e) {
            sb.append("\nTicket information unavailable.\n");
        }
    }

    // ============================================================
    // ROLE CONTEXT BUILDER
    // ============================================================

    private String buildRoleContextPrompt(User user, String role, Map<String, Object> liveData) {

        StringBuilder sb = new StringBuilder();

        sb.append(
                """
                        SYSTEM:
                        You are AquaTrack AI Assistant for Water Billing System.

                        Answer only from provided database context.
                        Never invent numbers.
                        Use ₹ for money.
                        Use Litres for water.
                        """);

        if (user == null) {
            sb.append("\nVisitor User");
            return sb.toString();
        }

        sb.append("\nLogged User Role: " + role);

        if ("RESIDENT".equals(role)) {
            collectResidentData(user, sb, liveData);
        } else if ("COMMUNITY_ADMIN".equals(role)) {
            collectCommunityAdminData(user, sb, liveData);
        } else if ("ADMIN".equals(role) || "SUPER_ADMIN".equals(role)) {
            collectSuperAdminData(user, sb, liveData);
        }

        return sb.toString();
    }

    // ============================================================
    // GEMINI SYSTEM PROMPT
    // ============================================================

    private String buildSystemPrompt(String role, String context, String page, String intent) {

        return String.format(
                """
                        You are AquaTrack AI.

                        Current Role:
                        %s

                        Current Page:
                        %s

                        Intent:
                        %s


                        Rules:

                        1. Answer user questions using database context.
                        2. Do not create fake information.
                        3. For missing data say:
                           "No data is available yet."
                        4. Give short helpful answers.
                        5. Explain calculations when asked (e.g. tier 1 vs tier 2 billing).
                        6. Guide users to correct dashboard section.
                        7. If asked about another resident's or another community's data, politely
                           explain that you can only answer about the logged-in user's own scope.


                        DATABASE CONTEXT:

                        %s


                        """,
                role, page, intent, context
        );
    }

    // ============================================================
    // INTENT DETECTION
    // ============================================================

    private String detectIntent(String msg) {

        if (msg == null) return "GENERAL";
        msg = msg.toLowerCase();

        if (msg.contains("bill") || msg.contains("invoice") || msg.contains("payment")
                || msg.contains("due") || msg.contains("last month")) {
            return "BILLING";
        }

        if (msg.contains("cycle") || msg.contains("period")) {
            return "BILLING_CYCLE";
        }

        if (msg.contains("tariff") || msg.contains("rate") || msg.contains("tier")) {
            return "TARIFF";
        }

        if (msg.contains("usage") || msg.contains("water") || msg.contains("litre")
                || msg.contains("consumption") || msg.contains("yesterday")) {
            return "USAGE";
        }

        if (msg.contains("ticket") || msg.contains("issue") || msg.contains("complaint") || msg.contains("concern")) {
            return "SUPPORT";
        }

        if (msg.contains("resident") || msg.contains("household") || msg.contains("community")) {
            return "COMMUNITY";
        }

        if (msg.contains("purchase") || msg.contains("tanker") || msg.contains("supply")) {
            return "WATER_PURCHASE";
        }

        if (msg.contains("approve") || msg.contains("pending") || msg.contains("registration")) {
            return "APPROVALS";
        }

        return "GENERAL";
    }

    // ============================================================
    // NAVIGATION
    // ============================================================

    private String resolveNavigation(String message, String role, String currentPage) {

        if (message == null) return null;
        String msg = message.toLowerCase();

        if (msg.contains("bill") || msg.contains("invoice") || msg.contains("cycle")) {
            if ("RESIDENT".equals(role)) return "/resident/dashboard?tab=bills";
            if ("COMMUNITY_ADMIN".equals(role)) return "/community/billing";
            return null;
        }

        if (msg.contains("tariff") || msg.contains("rate")) {
            if ("COMMUNITY_ADMIN".equals(role)) return "/community/tariff";
            return null;
        }

        if (msg.contains("usage") || msg.contains("water")) {
            if ("RESIDENT".equals(role)) return "/resident/dashboard?tab=usage";
            return "/community/dashboard";
        }

        if (msg.contains("ticket") || msg.contains("issue") || msg.contains("concern")) {
            if ("RESIDENT".equals(role)) return "/resident/dashboard?tab=tickets";
            if ("COMMUNITY_ADMIN".equals(role)) return "/community/tickets";
            if ("ADMIN".equals(role) || "SUPER_ADMIN".equals(role)) return "/admin/tickets";
        }

        if (msg.contains("approve") || msg.contains("pending")) {
            if ("ADMIN".equals(role) || "SUPER_ADMIN".equals(role)) return "/admin/community-admins";
        }

        return null;
    }

    // ============================================================
    // DYNAMIC SUGGESTIONS
    // ============================================================

    private List<String> generateSuggestions(String message, String role, String intent) {

        if ("RESIDENT".equals(role)) {
            return List.of(
                    "What's my bill this cycle?",
                    "How much water did I use yesterday?",
                    "What was my bill last month?",
                    "Show my ticket status"
            );
        }

        if ("COMMUNITY_ADMIN".equals(role)) {
            return List.of(
                    "What's today's community usage?",
                    "How much did we spend on water purchases last month?",
                    "What was our total billed last month?",
                    "How many tickets are pending?"
            );
        }

        if ("ADMIN".equals(role) || "SUPER_ADMIN".equals(role)) {
            return List.of(
                    "How many community admins are pending approval?",
                    "Show total platform revenue",
                    "What was last month's platform revenue?",
                    "How many tickets are escalated?"
            );
        }

        return List.of(
                "How does water billing work?",
                "How to register?"
        );
    }

    // ============================================================
    // CLEAN RESPONSE
    // ============================================================

    private String cleanMarkdown(String text) {
        if (text == null) return "";
        return text.replace("**", "").replace("#", "").trim();
    }
}