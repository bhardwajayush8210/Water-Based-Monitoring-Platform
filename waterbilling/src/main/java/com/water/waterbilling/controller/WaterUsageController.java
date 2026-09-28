package com.water.waterbilling.controller;

import com.water.waterbilling.dto.UsageEntryRequest;
import com.water.waterbilling.dto.ConsumptionComparisonResponse;
import com.water.waterbilling.entity.WaterUsageEntry;
import com.water.waterbilling.entity.User;
import com.water.waterbilling.repository.UserRepository;
import com.water.waterbilling.repository.WaterUsageRepository;
import com.water.waterbilling.service.WaterUsageService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usage")
@CrossOrigin(origins = "http://localhost:5173")
public class WaterUsageController {

    private final WaterUsageService service;
    private final UserRepository userRepository;
    private final WaterUsageRepository waterUsageRepository;

    public WaterUsageController(WaterUsageService service, UserRepository userRepository, WaterUsageRepository waterUsageRepository) {
        this.service = service;
        this.userRepository = userRepository;
        this.waterUsageRepository = waterUsageRepository;
    }

    // Resident: view own usage history (read-only, no self-entry anymore)
    @GetMapping("/my")
    public ResponseEntity<?> getMyUsage(Authentication authentication) {
        List<WaterUsageEntry> entries = service.getEntriesForUser(authentication.getName());
        return ResponseEntity.ok(entries);
    }

    // Community Admin: every resident in their community + today's status
    @GetMapping("/community/summary")
    public ResponseEntity<?> getTodaySummary(Authentication authentication) {
        return ResponseEntity.ok(service.getTodaySummaryForAdmin(authentication.getName()));
    }

    // Community Admin: log or update a specific resident's usage entry.
    // Ownership is checked server-side - an admin can only log usage for
    // residents that actually belong to their own community.
    @PostMapping("/community/{residentUsername}")
    public ResponseEntity<?> logUsageForResident(
            @PathVariable String residentUsername,
            @RequestBody UsageEntryRequest request,
            Authentication authentication
    ) {
        WaterUsageEntry saved = service.logUsageForResident(
                authentication.getName(), residentUsername, request
        );
        return ResponseEntity.ok(saved);
    }

    // Community Admin: full history for one specific resident
    @GetMapping("/community/{residentUsername}")
    public ResponseEntity<?> getResidentHistory(
            @PathVariable String residentUsername,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                service.getEntriesForResidentAsAdmin(authentication.getName(), residentUsername)
        );
    }

    // Resident: how their usage compares to others in their apartment, this month
    @GetMapping("/comparison/my")
    public ResponseEntity<?> getMyComparison(Authentication authentication) {
        User me = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (me.getApartment() == null) {
            return ResponseEntity.badRequest().body("No apartment assigned to this account.");
        }

        LocalDate today = LocalDate.now();
        LocalDate start = today.withDayOfMonth(1);
        LocalDate end = today.withDayOfMonth(today.lengthOfMonth());

        List<User> householdUsers = userRepository.findByApartment(me.getApartment()).stream()
                .filter(u -> "RESIDENT".equalsIgnoreCase(u.getRole()))
                .toList();

        Map<String, Double> totalsByUsername = new LinkedHashMap<>();
        for (User u : householdUsers) {
            double total = waterUsageRepository
                    .findByUsernameAndDateBetween(u.getUsername(), start, end)
                    .stream()
                    .mapToDouble(e -> e.getLitresUsed() == null ? 0.0 : e.getLitresUsed())
                    .sum();
            totalsByUsername.put(u.getUsername(), total);
        }

        if (totalsByUsername.isEmpty()) {
            return ResponseEntity.ok(new ConsumptionComparisonResponse());
        }

        List<Double> allTotals = new ArrayList<>(totalsByUsername.values());
        Collections.sort(allTotals);

        double average = allTotals.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        double median = allTotals.size() % 2 == 0
                ? (allTotals.get(allTotals.size() / 2 - 1) + allTotals.get(allTotals.size() / 2)) / 2.0
                : allTotals.get(allTotals.size() / 2);

        double myTotal = totalsByUsername.getOrDefault(me.getUsername(), 0.0);

        List<String> sortedUsernames = totalsByUsername.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
        int myRank = sortedUsernames.indexOf(me.getUsername()) + 1;

        double percentBelowAverage = average == 0 ? 0 : ((average - myTotal) / average) * 100.0;

        List<ConsumptionComparisonResponse.HouseholdBar> breakdown = new ArrayList<>();
        int counter = 1;
        for (String uname : sortedUsernames) {
            boolean isMe = uname.equals(me.getUsername());
            String label = isMe ? "You" : "Household " + counter;
            breakdown.add(new ConsumptionComparisonResponse.HouseholdBar(
                    label, totalsByUsername.get(uname), isMe
            ));
            if (!isMe) counter++;
        }

        ConsumptionComparisonResponse response = new ConsumptionComparisonResponse();
        response.setPeriodLabel(today.format(DateTimeFormatter.ofPattern("MMMM yyyy")));
        response.setMyTotalLitres(myTotal);
        response.setApartmentAverageLitres(average);
        response.setApartmentMedianLitres(median);
        response.setMyRank(myRank);
        response.setTotalHouseholds(sortedUsernames.size());
        response.setPercentBelowAverage(percentBelowAverage);
        response.setBreakdown(breakdown);

        return ResponseEntity.ok(response);
    }

}