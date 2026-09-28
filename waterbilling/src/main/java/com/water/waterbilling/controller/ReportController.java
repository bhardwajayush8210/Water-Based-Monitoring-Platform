package com.water.waterbilling.controller;

import com.water.waterbilling.dto.CommunityReportResponse;
import com.water.waterbilling.entity.*;
import com.water.waterbilling.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/community/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    private final UserRepository userRepository;
    private final ApartmentRepository apartmentRepository;
    private final WaterUsageRepository waterUsageRepository;
    private final InvoiceRepository invoiceRepository;
    private final TariffPlanRepository tariffPlanRepository;
    private final BillingCycleRepository billingCycleRepository;
    private final WaterPurchaseRepository waterPurchaseRepository;
    private final TicketRepository ticketRepository;

    public ReportController(
            UserRepository userRepository,
            ApartmentRepository apartmentRepository,
            WaterUsageRepository waterUsageRepository,
            InvoiceRepository invoiceRepository,
            TariffPlanRepository tariffPlanRepository,
            BillingCycleRepository billingCycleRepository,
            WaterPurchaseRepository waterPurchaseRepository,
            TicketRepository ticketRepository
    ) {
        this.userRepository = userRepository;
        this.apartmentRepository = apartmentRepository;
        this.waterUsageRepository = waterUsageRepository;
        this.invoiceRepository = invoiceRepository;
        this.tariffPlanRepository = tariffPlanRepository;
        this.billingCycleRepository = billingCycleRepository;
        this.waterPurchaseRepository = waterPurchaseRepository;
        this.ticketRepository = ticketRepository;
    }

    @GetMapping("/overview")
    public ResponseEntity<?> getOverview(Authentication authentication) {

        User admin = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Apartment apartment = apartmentRepository.findByCommunityAdmin(admin)
                .orElseThrow(() -> new RuntimeException("No community assigned"));

        String apartmentName = apartment.getApartmentName();

        List<User> residents = userRepository.findByApartmentAndRole(apartmentName, "RESIDENT");
        List<String> usernames = residents.stream().map(User::getUsername).toList();

        // ================= ALL-TIME USAGE (per resident + monthly trend) =================

        List<WaterUsageEntry> allEntries = waterUsageRepository.findByUsernameInOrderByDateAsc(usernames);

        double totalUsage = allEntries.stream().mapToDouble(WaterUsageEntry::getLitresUsed).sum();

        Map<String, Double> monthlyTotals = new LinkedHashMap<>();
        DateTimeFormatter monthFmt = DateTimeFormatter.ofPattern("MMM yyyy");

        allEntries.stream()
                .sorted(Comparator.comparing(WaterUsageEntry::getDate))
                .forEach(e -> {
                    String label = e.getDate().format(monthFmt);
                    monthlyTotals.merge(label, e.getLitresUsed(), Double::sum);
                });

        List<CommunityReportResponse.MonthlyPoint> usageTrend = monthlyTotals.entrySet().stream()
                .map(en -> new CommunityReportResponse.MonthlyPoint(en.getKey(), en.getValue()))
                .collect(Collectors.toList());

        Map<String, Double> usageByUsername = new HashMap<>();
        for (WaterUsageEntry e : allEntries) {
            usageByUsername.merge(e.getUsername(), e.getLitresUsed(), Double::sum);
        }

        Map<String, String> flatByUsername = residents.stream()
                .collect(Collectors.toMap(User::getUsername, u -> u.getFlatNumber() != null ? u.getFlatNumber() : u.getUsername()));

        List<CommunityReportResponse.ResidentBar> residentBreakdown = usageByUsername.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .map(en -> new CommunityReportResponse.ResidentBar(
                        flatByUsername.getOrDefault(en.getKey(), en.getKey()),
                        en.getValue()
                ))
                .collect(Collectors.toList());

        // ================= ALL-TIME REVENUE (by billing cycle) + CYCLE DETAILS =================

        List<BillingCycle> cycles = billingCycleRepository.findByApartmentOrderByStartDateDesc(apartment);

        List<CommunityReportResponse.CyclePoint> revenueTrend = new ArrayList<>();
        List<CommunityReportResponse.CycleDetail> cycleDetails = new ArrayList<>();
        Map<String, Double> revenueByUsername = new HashMap<>();
        double totalRevenue = 0;

        List<BillingCycle> chronological = new ArrayList<>(cycles);
        Collections.reverse(chronological);

        for (BillingCycle cycle : chronological) {
            List<Invoice> cycleInvoices = invoiceRepository.findByBillingCycleOrderByResidentFullNameAsc(cycle);
            double cycleTotal = cycleInvoices.stream().mapToDouble(Invoice::getTotalInr).sum();
            revenueTrend.add(new CommunityReportResponse.CyclePoint(cycle.getPeriodLabel(), cycleTotal));
            totalRevenue += cycleTotal;

            for (Invoice inv : cycleInvoices) {
                revenueByUsername.merge(inv.getResidentUsername(), inv.getTotalInr(), Double::sum);
            }
        }

        // cycle detail table, most recent first
        for (BillingCycle cycle : cycles) {
            List<Invoice> cycleInvoices = invoiceRepository.findByBillingCycleOrderByResidentFullNameAsc(cycle);
            double cycleTotal = cycleInvoices.stream().mapToDouble(Invoice::getTotalInr).sum();
            cycleDetails.add(new CommunityReportResponse.CycleDetail(
                    cycle.getPeriodLabel(),
                    cycle.getStartDate(),
                    cycle.getEndDate(),
                    cycle.getStatus(),
                    cycleTotal,
                    cycleInvoices.size()
            ));
        }

        List<CommunityReportResponse.ResidentBar> residentRevenueBreakdown = revenueByUsername.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .map(en -> new CommunityReportResponse.ResidentBar(
                        flatByUsername.getOrDefault(en.getKey(), en.getKey()),
                        en.getValue()
                ))
                .collect(Collectors.toList());

        // ================= WATER PURCHASES (total + by source) =================

        List<WaterPurchase> purchases = waterPurchaseRepository.findByApartmentOrderByPurchaseDateDesc(apartment);
        double totalPurchaseCost = purchases.stream().mapToDouble(WaterPurchase::getTotalCostInr).sum();

        Map<String, double[]> bySource = new LinkedHashMap<>(); // [cost, volume]
        for (WaterPurchase p : purchases) {
            bySource.computeIfAbsent(p.getSource(), k -> new double[2]);
            bySource.get(p.getSource())[0] += p.getTotalCostInr();
            bySource.get(p.getSource())[1] += p.getTotalVolumeLitres();
        }
        List<CommunityReportResponse.SourceBreakdown> purchaseBySource = bySource.entrySet().stream()
                .map(en -> new CommunityReportResponse.SourceBreakdown(en.getKey(), en.getValue()[0], en.getValue()[1]))
                .collect(Collectors.toList());

        // ================= TICKET STATS =================

        List<Ticket> communityTickets = ticketRepository.findByApartmentAndTargetRoleOrderByCreatedAtDesc(
                apartmentName, Ticket.TargetRole.COMMUNITY_ADMIN);

        long openTickets = communityTickets.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.OPEN).count();
        long inProgressTickets = communityTickets.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.IN_PROGRESS).count();
        long resolvedTickets = communityTickets.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.RESOLVED).count();
        long escalatedTickets = communityTickets.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.ESCALATED).count();

        // ================= ASSEMBLE RESPONSE =================

        CommunityReportResponse response = new CommunityReportResponse();
        response.setTotalResidents(residents.size());
        response.setTotalUsageLitres(totalUsage);
        response.setTotalRevenueInr(totalRevenue);
        response.setTotalWaterPurchaseCostInr(totalPurchaseCost);
        response.setUsageTrend(usageTrend);
        response.setRevenueTrend(revenueTrend);
        response.setResidentBreakdown(residentBreakdown);
        response.setResidentRevenueBreakdown(residentRevenueBreakdown);
        response.setCycleDetails(cycleDetails);
        response.setAverageUsagePerHouseholdLitres(residents.isEmpty() ? 0 : totalUsage / residents.size());
        response.setPurchaseBySource(purchaseBySource);
        response.setOpenTickets(openTickets);
        response.setInProgressTickets(inProgressTickets);
        response.setResolvedTickets(resolvedTickets);
        response.setEscalatedTickets(escalatedTickets);

        return ResponseEntity.ok(response);
    }
}