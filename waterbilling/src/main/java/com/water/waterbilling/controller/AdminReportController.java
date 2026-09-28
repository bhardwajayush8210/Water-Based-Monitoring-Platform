package com.water.waterbilling.controller;

import com.water.waterbilling.dto.AdminReportResponse;
import com.water.waterbilling.entity.*;
import com.water.waterbilling.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminReportController {

    private final UserRepository userRepository;
    private final ApartmentRepository apartmentRepository;
    private final WaterUsageRepository waterUsageRepository;
    private final InvoiceRepository invoiceRepository;
    private final WaterPurchaseRepository waterPurchaseRepository;
    private final TicketRepository ticketRepository;

    public AdminReportController(
            UserRepository userRepository,
            ApartmentRepository apartmentRepository,
            WaterUsageRepository waterUsageRepository,
            InvoiceRepository invoiceRepository,
            WaterPurchaseRepository waterPurchaseRepository,
            TicketRepository ticketRepository
    ) {
        this.userRepository = userRepository;
        this.apartmentRepository = apartmentRepository;
        this.waterUsageRepository = waterUsageRepository;
        this.invoiceRepository = invoiceRepository;
        this.waterPurchaseRepository = waterPurchaseRepository;
        this.ticketRepository = ticketRepository;
    }

    @GetMapping("/overview")
    public ResponseEntity<?> getOverview() {

        List<User> allUsers = userRepository.findAll();

        List<User> residents = allUsers.stream()
                .filter(u -> "RESIDENT".equals(u.getRole()))
                .toList();

        List<User> communityAdmins = allUsers.stream()
                .filter(u -> "COMMUNITY_ADMIN".equals(u.getRole()))
                .toList();

        long pendingApprovals = communityAdmins.stream()
                .filter(u -> !Boolean.TRUE.equals(u.getApproved()))
                .count();

        List<Apartment> apartments = apartmentRepository.findAll();

        // username -> apartment name, for grouping usage by community
        Map<String, String> apartmentByUsername = residents.stream()
                .filter(u -> u.getApartment() != null)
                .collect(Collectors.toMap(User::getUsername, User::getApartment, (a, b) -> a));

        // ================= PLATFORM USAGE (all-time + monthly trend) =================

        List<WaterUsageEntry> allUsageEntries = waterUsageRepository.findAll();
        double totalUsage = allUsageEntries.stream().mapToDouble(WaterUsageEntry::getLitresUsed).sum();

        DateTimeFormatter monthFmt = DateTimeFormatter.ofPattern("MMM yyyy");
        Map<YearMonth, Double> usageByMonth = new TreeMap<>();
        for (WaterUsageEntry e : allUsageEntries) {
            YearMonth ym = YearMonth.from(e.getDate());
            usageByMonth.merge(ym, e.getLitresUsed(), Double::sum);
        }
        List<AdminReportResponse.MonthlyPoint> usageTrend = usageByMonth.entrySet().stream()
                .map(en -> new AdminReportResponse.MonthlyPoint(en.getKey().format(monthFmt), en.getValue()))
                .collect(Collectors.toList());

        // usage per community
        Map<String, Double> usageByApartment = new HashMap<>();
        for (WaterUsageEntry e : allUsageEntries) {
            String apt = apartmentByUsername.get(e.getUsername());
            if (apt == null) continue;
            usageByApartment.merge(apt, e.getLitresUsed(), Double::sum);
        }

        // ================= PLATFORM REVENUE (all-time + monthly trend) =================

        List<Invoice> allInvoices = invoiceRepository.findAll();
        double totalRevenue = allInvoices.stream().mapToDouble(Invoice::getTotalInr).sum();

        Map<YearMonth, Double> revenueByMonth = new TreeMap<>();
        Map<String, Double> revenueByApartment = new HashMap<>();

        for (Invoice inv : allInvoices) {
            if (inv.getBillingCycle() == null || inv.getBillingCycle().getStartDate() == null) continue;

            YearMonth ym = YearMonth.from(inv.getBillingCycle().getStartDate());
            revenueByMonth.merge(ym, inv.getTotalInr(), Double::sum);

            Apartment apt = inv.getBillingCycle().getApartment();
            if (apt != null) {
                revenueByApartment.merge(apt.getApartmentName(), inv.getTotalInr(), Double::sum);
            }
        }

        List<AdminReportResponse.MonthlyPoint> revenueTrend = revenueByMonth.entrySet().stream()
                .map(en -> new AdminReportResponse.MonthlyPoint(en.getKey().format(monthFmt), en.getValue()))
                .collect(Collectors.toList());

        // ================= PLATFORM WATER PURCHASES =================

        List<WaterPurchase> allPurchases = waterPurchaseRepository.findAll();
        double totalPurchaseCost = allPurchases.stream().mapToDouble(WaterPurchase::getTotalCostInr).sum();

        Map<String, Double> purchaseCostByApartment = new HashMap<>();
        for (WaterPurchase p : allPurchases) {
            if (p.getApartment() == null) continue;
            purchaseCostByApartment.merge(p.getApartment().getApartmentName(), p.getTotalCostInr(), Double::sum);
        }

        // ================= COMMUNITY BREAKDOWN (comparison) =================

        Map<String, Integer> residentCountByApartment = new HashMap<>();
        for (User r : residents) {
            if (r.getApartment() == null) continue;
            residentCountByApartment.merge(r.getApartment(), 1, Integer::sum);
        }

        List<AdminReportResponse.CommunityBar> communityBreakdown = apartments.stream()
                .map(apt -> new AdminReportResponse.CommunityBar(
                        apt.getApartmentName(),
                        residentCountByApartment.getOrDefault(apt.getApartmentName(), 0),
                        usageByApartment.getOrDefault(apt.getApartmentName(), 0.0),
                        revenueByApartment.getOrDefault(apt.getApartmentName(), 0.0),
                        purchaseCostByApartment.getOrDefault(apt.getApartmentName(), 0.0)
                ))
                .sorted(Comparator.comparingDouble(AdminReportResponse.CommunityBar::getTotalUsageLitres).reversed())
                .collect(Collectors.toList());

        // ================= TICKET QUEUE =================

        List<Ticket> queue = ticketRepository.findByTargetRoleOrderByCreatedAtDesc(Ticket.TargetRole.SUPER_ADMIN);
        long open = queue.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.OPEN).count();
        long escalated = queue.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.ESCALATED).count();
        long resolved = queue.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.RESOLVED).count();

        // ================= ASSEMBLE RESPONSE =================

        AdminReportResponse response = new AdminReportResponse();
        response.setTotalUsers(allUsers.size());
        response.setTotalResidents(residents.size());
        response.setTotalCommunityAdmins(communityAdmins.size());
        response.setPendingApprovals(pendingApprovals);
        response.setTotalCommunities(apartments.size());
        response.setTotalUsageLitres(totalUsage);
        response.setTotalRevenueInr(totalRevenue);
        response.setTotalWaterPurchaseCostInr(totalPurchaseCost);
        response.setOpenTickets(open);
        response.setEscalatedTickets(escalated);
        response.setResolvedTickets(resolved);
        response.setUsageTrend(usageTrend);
        response.setRevenueTrend(revenueTrend);
        response.setCommunityBreakdown(communityBreakdown);

        return ResponseEntity.ok(response);
    }
}