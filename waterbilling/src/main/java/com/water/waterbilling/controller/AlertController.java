package com.water.waterbilling.controller;

import com.water.waterbilling.service.AlertScanService;
import com.water.waterbilling.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AlertController {

    private final AlertService alertService;
    private final AlertScanService alertScanService;

    public AlertController(AlertService alertService, AlertScanService alertScanService) {
        this.alertService = alertService;
        this.alertScanService = alertScanService;
    }

    // ---- Community Admin: live threshold check (existing) ----

    @GetMapping("/api/community/alerts")
    public ResponseEntity<?> getCommunityAlerts(Authentication authentication) {
        return ResponseEntity.ok(alertService.getAlertsForAdmin(authentication.getName()));
    }

    @GetMapping("/api/community/alert-threshold")
    public ResponseEntity<?> getAlertThreshold(Authentication authentication) {
        return ResponseEntity.ok(Map.of("dailyAlertThresholdLitres", alertService.getAlertThreshold(authentication.getName())));
    }

    @PutMapping("/api/community/alert-threshold")
    public ResponseEntity<?> updateAlertThreshold(
            @RequestBody Map<String, Double> body,
            Authentication authentication
    ) {
        double newThreshold = body.get("dailyAlertThresholdLitres");
        double updated = alertService.updateAlertThreshold(authentication.getName(), newThreshold);
        return ResponseEntity.ok(Map.of("dailyAlertThresholdLitres", updated));
    }

    // ---- Community Admin: persisted, scheduled-scan-generated alerts ----

    @GetMapping("/api/community/alerts/persisted")
    public ResponseEntity<?> getPersistedAlerts(Authentication authentication) {
        return ResponseEntity.ok(alertScanService.getAlertsForAdmin(authentication.getName()));
    }

    @PostMapping("/api/community/alerts/scan-now")
    public ResponseEntity<?> scanNow(Authentication authentication) {
        alertScanService.scanApartmentByAdmin(authentication.getName());
        return ResponseEntity.ok("Scan complete");
    }

    // ---- Resident ----

    @GetMapping("/api/alerts/my")
    public ResponseEntity<?> getMyAlerts(Authentication authentication) {
        return ResponseEntity.ok(alertService.getAlertsForResident(authentication.getName()));
    }

    @GetMapping("/api/notifications/my")
    public ResponseEntity<?> getMyNotifications(Authentication authentication) {
        return ResponseEntity.ok(alertScanService.getAlertsForResident(authentication.getName()));
    }

    @PutMapping("/api/notifications/{id}/read")
    public ResponseEntity<?> markNotificationRead(@PathVariable Long id, Authentication authentication) {
        alertScanService.markAsRead(authentication.getName(), id);
        return ResponseEntity.ok("Marked as read");
    }

}