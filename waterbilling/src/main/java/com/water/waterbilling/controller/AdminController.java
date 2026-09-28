package com.water.waterbilling.controller;

import com.water.waterbilling.dto.CommunityAdminUpdateRequest;
import com.water.waterbilling.dto.ResidentSummaryResponse;
import com.water.waterbilling.dto.ResidentUpdateRequest;
import com.water.waterbilling.entity.User;
import com.water.waterbilling.entity.WaterUsageEntry;
import com.water.waterbilling.service.CommunityAdminService;
import com.water.waterbilling.service.WaterUsageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final CommunityAdminService communityAdminService;
    private final WaterUsageService waterUsageService;

    public AdminController(CommunityAdminService communityAdminService, WaterUsageService waterUsageService) {
        this.communityAdminService = communityAdminService;
        this.waterUsageService = waterUsageService;
    }

    /**
     * Super Admin only: residents belonging to a specific apartment,
     * enriched with each resident's today/weekly usage totals rather
     * than returning the raw User list.
     */
    @GetMapping("/apartments/{id}/residents")
    public ResponseEntity<?> getResidentsForApartment(@PathVariable Long id) {

        List<User> residents = communityAdminService.getResidentsByApartmentId(id);
        List<String> usernames = residents.stream().map(User::getUsername).toList();

        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(6);

        List<WaterUsageEntry> allEntries = waterUsageService.getEntriesForUsers(usernames);

        Map<String, Double> todayMap = allEntries.stream()
                .filter(e -> e.getDate().isEqual(today))
                .collect(Collectors.toMap(WaterUsageEntry::getUsername, WaterUsageEntry::getLitresUsed, (a, b) -> a));

        Map<String, Double> weeklyMap = allEntries.stream()
                .filter(e -> !e.getDate().isBefore(sevenDaysAgo))
                .collect(Collectors.groupingBy(WaterUsageEntry::getUsername, Collectors.summingDouble(WaterUsageEntry::getLitresUsed)));

        List<ResidentSummaryResponse> summaries = residents.stream()
                .map(r -> new ResidentSummaryResponse(
                        r.getId(),
                        r.getFullName(),
                        r.getUsername(),
                        r.getPhone(),
                        r.getFlatNumber(),
                        todayMap.get(r.getUsername()),
                        weeklyMap.get(r.getUsername())
                ))
                .toList();

        return ResponseEntity.ok(summaries);
    }

    /**
     * Platform-wide stats for the Super Admin dashboard overview.
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getPlatformStats() {
        return ResponseEntity.ok(communityAdminService.getPlatformStats());
    }

    /**
     * Every Community Admin still awaiting approval.
     */
    @GetMapping("/community-admins/pending")
    public ResponseEntity<?> getPendingCommunityAdmins() {
        return ResponseEntity.ok(communityAdminService.getPendingCommunityAdmins());
    }

    /**
     * Approves a pending Community Admin, unlocking their dashboard.
     */
    @PutMapping("/community-admins/{id}/approve")
    public ResponseEntity<?> approveCommunityAdmin(@PathVariable Long id) {
        communityAdminService.approveCommunityAdmin(id);
        return ResponseEntity.ok("Community Admin approved successfully");
    }

    /**
     * Updates a Community Admin's basic details (name, email, phone).
     * Does not touch their apartment, credentials, or approval status.
     */
    @PutMapping("/community-admins/{id}")
    public ResponseEntity<?> updateCommunityAdmin(
            @PathVariable Long id,
            @RequestBody CommunityAdminUpdateRequest request
    ) {
        return ResponseEntity.ok(
                communityAdminService.updateCommunityAdmin(id, request.getFullName(), request.getEmail(), request.getPhone())
        );
    }

    /**
     * Deletes a Community Admin along with their apartment. Their
     * residents are NOT deleted - see CommunityAdminService for why.
     */
    @DeleteMapping("/community-admins/{id}")
    public ResponseEntity<?> deleteCommunityAdmin(@PathVariable Long id) {
        communityAdminService.deleteCommunityAdmin(id);
        return ResponseEntity.ok("Community Admin and their apartment deleted successfully");
    }

    /**
     * Updates a Resident's basic details (name, email, phone, flat number).
     */
    @PutMapping("/residents/{id}")
    public ResponseEntity<?> updateResident(
            @PathVariable Long id,
            @RequestBody ResidentUpdateRequest request
    ) {
        return ResponseEntity.ok(
                communityAdminService.updateResident(
                        id, request.getFullName(), request.getEmail(), request.getPhone(), request.getFlatNumber()
                )
        );
    }

}