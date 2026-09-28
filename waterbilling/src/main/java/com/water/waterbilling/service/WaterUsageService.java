package com.water.waterbilling.service;

import com.water.waterbilling.dto.ResidentUsageSummary;
import com.water.waterbilling.dto.UsageEntryRequest;
import com.water.waterbilling.entity.Apartment;
import com.water.waterbilling.entity.User;
import com.water.waterbilling.entity.WaterUsageEntry;
import com.water.waterbilling.repository.ApartmentRepository;
import com.water.waterbilling.repository.UserRepository;
import com.water.waterbilling.repository.WaterUsageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class WaterUsageService {

    private final WaterUsageRepository repository;
    private final UserRepository userRepository;
    private final ApartmentRepository apartmentRepository;

    public WaterUsageService(
            WaterUsageRepository repository,
            UserRepository userRepository,
            ApartmentRepository apartmentRepository
    ) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.apartmentRepository = apartmentRepository;
    }

    private WaterUsageEntry saveOrUpdateEntry(String residentUsername, UsageEntryRequest request) {

        Optional<WaterUsageEntry> existing =
                repository.findByUsernameAndDate(residentUsername, request.getDate());

        // Usage can only be set once per resident per day. Once logged,
        // it's locked for that date - no further edits, even by the
        // Community Admin who entered it.
        if (existing.isPresent()) {
            throw new RuntimeException(
                    "Usage for " + residentUsername + " on " + request.getDate()
                            + " has already been logged and cannot be changed."
            );
        }

        WaterUsageEntry entry = new WaterUsageEntry();
        entry.setUsername(residentUsername);
        entry.setDate(request.getDate());
        entry.setLitresUsed(request.getLitresUsed());

        return repository.save(entry);
    }

    /**
     * Confirms the given resident actually belongs to the given Community
     * Admin's apartment. Throws if not - this is what stops a Community
     * Admin from logging usage for a resident outside their own community.
     */
    private void assertResidentBelongsToAdmin(String adminUsername, String residentUsername) {

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Apartment apartment = apartmentRepository.findByCommunityAdmin(admin)
                .orElseThrow(() -> new RuntimeException("No apartment found for this admin"));

        User resident = userRepository.findByUsername(residentUsername)
                .orElseThrow(() -> new RuntimeException("Resident not found"));

        if (!"RESIDENT".equals(resident.getRole())) {
            throw new RuntimeException("This user is not a resident");
        }

        if (!apartment.getApartmentName().equalsIgnoreCase(resident.getApartment())) {
            throw new RuntimeException("This resident does not belong to your community");
        }
    }

    /**
     * Community Admin logs (or updates) a usage entry on behalf of one of
     * their own residents. This is the only way usage entries get created -
     * residents no longer self-report.
     */
    public WaterUsageEntry logUsageForResident(
            String adminUsername,
            String residentUsername,
            UsageEntryRequest request
    ) {
        assertResidentBelongsToAdmin(adminUsername, residentUsername);
        return saveOrUpdateEntry(residentUsername, request);
    }

    /**
     * Community Admin views a specific resident's full usage history.
     */
    public List<WaterUsageEntry> getEntriesForResidentAsAdmin(String adminUsername, String residentUsername) {
        assertResidentBelongsToAdmin(adminUsername, residentUsername);
        return repository.findByUsernameOrderByDateAsc(residentUsername);
    }

    /**
     * Resident views their own usage history (read-only).
     */
    public List<WaterUsageEntry> getEntriesForUser(String username) {
        return repository.findByUsernameOrderByDateAsc(username);
    }

    /**
     * Bulk fetch: every usage entry for a set of usernames, used when
     * building summaries across multiple residents at once (e.g. Super
     * Admin's community drill-down, Community Admin's dashboard stats).
     */
    public List<WaterUsageEntry> getEntriesForUsers(List<String> usernames) {
        if (usernames == null || usernames.isEmpty()) {
            return List.of();
        }
        return repository.findByUsernameInOrderByDateAsc(usernames);
    }

    /**
     * Community Admin's entry screen: every resident in their community,
     * with today's logged litres if an entry already exists for today.
     */
    public List<ResidentUsageSummary> getTodaySummaryForAdmin(String adminUsername) {

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Apartment apartment = apartmentRepository.findByCommunityAdmin(admin)
                .orElseThrow(() -> new RuntimeException("No apartment found for this admin"));

        String apartmentName = apartment.getApartmentName();
        LocalDate today = LocalDate.now();

        List<User> residents = userRepository.findAll().stream()
                .filter(u -> "RESIDENT".equals(u.getRole()))
                .filter(u -> apartmentName.equalsIgnoreCase(u.getApartment()))
                .toList();

        return residents.stream()
                .map(r -> {
                    Double todayLitres = repository
                            .findByUsernameAndDate(r.getUsername(), today)
                            .map(WaterUsageEntry::getLitresUsed)
                            .orElse(null);
                    return new ResidentUsageSummary(r.getUsername(), r.getFullName(), r.getFlatNumber(), todayLitres);
                })
                .toList();
    }

}