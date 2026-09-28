package com.water.waterbilling.controller;

import com.water.waterbilling.dto.WaterPurchaseRequest;
import com.water.waterbilling.service.WaterPurchaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community/water-purchases")
@CrossOrigin(origins = "http://localhost:5173")
public class WaterPurchaseController {

    private final WaterPurchaseService service;

    public WaterPurchaseController(WaterPurchaseService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<?> getPurchases(Authentication authentication) {
        return ResponseEntity.ok(service.getPurchasesForAdmin(authentication.getName()));
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(Authentication authentication) {
        return ResponseEntity.ok(service.getThisMonthSummary(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<?> addPurchase(
            @RequestBody WaterPurchaseRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(service.addPurchase(authentication.getName(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePurchase(@PathVariable Long id, Authentication authentication) {
        service.deletePurchase(authentication.getName(), id);
        return ResponseEntity.ok("Purchase record deleted");
    }

}