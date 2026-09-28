package com.water.waterbilling.controller;

import com.water.waterbilling.dto.BillingOverviewResponse;
import com.water.waterbilling.entity.*;
import com.water.waterbilling.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/billing-overview")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminBillingController {

    private final BillingCycleRepository billingCycleRepository;
    private final InvoiceRepository invoiceRepository;

    public AdminBillingController(
            BillingCycleRepository billingCycleRepository,
            InvoiceRepository invoiceRepository
    ) {
        this.billingCycleRepository = billingCycleRepository;
        this.invoiceRepository = invoiceRepository;
    }

    // Every billing cycle across every community, most recent first
    @GetMapping
    public ResponseEntity<?> getAllCycles() {

        List<BillingCycle> cycles = billingCycleRepository.findAll();

        List<BillingOverviewResponse> result = cycles.stream()
                .sorted(Comparator.comparing(BillingCycle::getStartDate).reversed())
                .map(cycle -> {
                    List<Invoice> invoices = invoiceRepository.findByBillingCycleOrderByResidentFullNameAsc(cycle);
                    double total = invoices.stream().mapToDouble(Invoice::getTotalInr).sum();

                    Apartment apartment = cycle.getApartment();
                    User communityAdmin = apartment != null ? apartment.getCommunityAdmin() : null;

                    BillingOverviewResponse dto = new BillingOverviewResponse();
                    dto.setCycleId(cycle.getId());
                    dto.setApartmentName(apartment != null ? apartment.getApartmentName() : "Unknown");
                    dto.setCommunityAdminName(communityAdmin != null ? communityAdmin.getFullName() : "Unassigned");
                    dto.setCommunityAdminUsername(communityAdmin != null ? communityAdmin.getUsername() : null);
                    dto.setPeriodLabel(cycle.getPeriodLabel());
                    dto.setStartDate(cycle.getStartDate());
                    dto.setEndDate(cycle.getEndDate());
                    dto.setStatus(cycle.getStatus());
                    dto.setTotalBilledInr(total);
                    dto.setResidentCount(invoices.size());
                    dto.setInvoiceCount(invoices.size());

                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    // Resident-level invoice detail for one specific cycle (any community)
    @GetMapping("/{cycleId}/invoices")
    public ResponseEntity<?> getCycleInvoices(@PathVariable Long cycleId) {

        BillingCycle cycle = billingCycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Billing cycle not found"));

        List<Invoice> invoices = invoiceRepository.findByBillingCycleOrderByResidentFullNameAsc(cycle);

        return ResponseEntity.ok(invoices);
    }
}