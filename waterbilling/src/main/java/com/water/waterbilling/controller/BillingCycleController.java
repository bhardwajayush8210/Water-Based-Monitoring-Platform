package com.water.waterbilling.controller;

import com.water.waterbilling.dto.AdjustmentRequest;
import com.water.waterbilling.dto.OpenCycleRequest;
import com.water.waterbilling.service.BillingCycleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class BillingCycleController {

    private final BillingCycleService service;

    public BillingCycleController(BillingCycleService service) {
        this.service = service;
    }

    // ---- Community Admin ----

    @GetMapping("/api/community/billing-cycles")
    public ResponseEntity<?> getCycles(Authentication authentication) {
        return ResponseEntity.ok(service.getCyclesForAdmin(authentication.getName()));
    }

    @PostMapping("/api/community/billing-cycles")
    public ResponseEntity<?> openCycle(@RequestBody OpenCycleRequest request, Authentication authentication) {
        return ResponseEntity.ok(service.openCycle(authentication.getName(), request));
    }

    @PostMapping("/api/community/billing-cycles/{id}/finalize")
    public ResponseEntity<?> finalizeCycle(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(service.finalizeCycle(authentication.getName(), id));
    }

    @PostMapping("/api/community/billing-cycles/{id}/archive")
    public ResponseEntity<?> archiveCycle(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(service.archiveCycle(authentication.getName(), id));
    }

    @GetMapping("/api/community/billing-cycles/{id}/invoices")
    public ResponseEntity<?> getInvoices(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(service.getInvoicesForCycle(authentication.getName(), id));
    }

    @PutMapping("/api/community/invoices/{invoiceId}/adjustment")
    public ResponseEntity<?> applyAdjustment(
            @PathVariable Long invoiceId,
            @RequestBody AdjustmentRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(service.applyAdjustment(authentication.getName(), invoiceId, request));
    }

    // ---- Resident ----

    @GetMapping("/api/invoices/my")
    public ResponseEntity<?> getMyInvoices(Authentication authentication) {
        return ResponseEntity.ok(service.getInvoicesForResident(authentication.getName()));
    }

}