package com.water.waterbilling.controller;

import com.water.waterbilling.dto.ApartmentDetailsRequest;
import com.water.waterbilling.dto.CommunityAdminRegisterRequest;
import com.water.waterbilling.dto.MeterNumberRequest;
import com.water.waterbilling.service.CommunityAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = "http://localhost:5173")
public class CommunityAdminController {

    private final CommunityAdminService service;

    public CommunityAdminController(CommunityAdminService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody CommunityAdminRegisterRequest request){

        return ResponseEntity.ok(
                service.registerCommunityAdmin(request)
        );

    }

    /**
     * Returns residents belonging only to the logged-in Community Admin's
     * apartment. Authentication is populated by JwtAuthenticationFilter
     * from the Bearer token - authentication.getName() is the username.
     */
    @GetMapping("/residents")
    public ResponseEntity<?> getMyResidents(Authentication authentication) {

        return ResponseEntity.ok(
                service.getResidentsForAdmin(authentication.getName())
        );
    }

    @GetMapping("/apartment")
    public ResponseEntity<?> getMyApartment(Authentication authentication) {

        return ResponseEntity.ok(
                service.getMyApartment(authentication.getName())
        );
    }

    @PutMapping("/apartment")
    public ResponseEntity<?> updateMyApartment(
            @RequestBody ApartmentDetailsRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                service.updateMyApartment(authentication.getName(), request)
        );
    }

    /**
     * Dashboard overview for the logged-in Community Admin: resident
     * count, total flats, today's community-wide usage, 7-day trend.
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getMyStats(Authentication authentication) {
        return ResponseEntity.ok(
                service.getCommunityStats(authentication.getName())
        );
    }

    /**
     * Returns the invite token the Community Admin can share with
     * residents. The frontend builds the full shareable URL from this.
     */
    @GetMapping("/invite-token")
    public ResponseEntity<?> getInviteToken(Authentication authentication) {
        return ResponseEntity.ok(
                java.util.Map.of("token", service.getMyInviteToken(authentication.getName()))
        );
    }

    /**
     * Assigns or updates the physical water meter number for one of the
     * admin's own residents. Manual entry, not auto-generated - see
     * CommunityAdminService.assignMeterNumber for why.
     */
    @PutMapping("/residents/{residentId}/meter-number")
    public ResponseEntity<?> assignMeterNumber(
            @PathVariable Long residentId,
            @RequestBody MeterNumberRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                service.assignMeterNumber(authentication.getName(), residentId, request.getMeterNumber())
        );
    }

    /**
     * Bulk-fills a placeholder meter number for every resident who
     * doesn't have one yet. Convenience only - existing values are
     * never overwritten.
     */
    @PostMapping("/residents/auto-assign-meters")
    public ResponseEntity<?> autoAssignMeters(Authentication authentication) {
        int count = service.autoAssignMissingMeterNumbers(authentication.getName());
        return ResponseEntity.ok(java.util.Map.of("assignedCount", count));
    }

}