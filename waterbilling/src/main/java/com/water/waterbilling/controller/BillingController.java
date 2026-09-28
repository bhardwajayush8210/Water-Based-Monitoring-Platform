package com.water.waterbilling.controller;



import com.water.waterbilling.dto.TariffPlanRequest;

import com.water.waterbilling.entity.TariffPlan;

import com.water.waterbilling.service.BillingService;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;



@RestController

@CrossOrigin(origins = "http://localhost:5173")

public class BillingController {



    private final BillingService billingService;



    public BillingController(BillingService billingService) {

        this.billingService = billingService;

    }



// ---- Community Admin ----



    @GetMapping("/api/community/tariff")

    public ResponseEntity<?> getTariff(Authentication authentication) {

        TariffPlan plan = billingService.getTariffPlan(authentication.getName());

        return ResponseEntity.ok(plan);

    }



    @PutMapping("/api/community/tariff")

    public ResponseEntity<?> updateTariff(

            @RequestBody TariffPlanRequest request,

            Authentication authentication

    ) {

        return ResponseEntity.ok(

                billingService.updateTariffPlan(authentication.getName(), request)

        );

    }



    @GetMapping("/api/community/billing")

    public ResponseEntity<?> getResidentBills(Authentication authentication) {

        return ResponseEntity.ok(

                billingService.getResidentBills(authentication.getName())

        );

    }



// ---- Resident ----



    @GetMapping("/api/billing/my")

    public ResponseEntity<?> getMyBill(Authentication authentication) {

        return ResponseEntity.ok(

                billingService.getMyBill(authentication.getName())

        );

    }



}