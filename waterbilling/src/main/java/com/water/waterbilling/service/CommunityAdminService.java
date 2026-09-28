package com.water.waterbilling.service;

import com.water.waterbilling.dto.ApartmentDetailsRequest;
import com.water.waterbilling.dto.CommunityAdminRegisterRequest;
import com.water.waterbilling.dto.CommunityStatsResponse;
import com.water.waterbilling.dto.PendingAdminSummary;
import com.water.waterbilling.dto.PlatformStatsResponse;
import com.water.waterbilling.entity.Apartment;
import com.water.waterbilling.entity.User;
import com.water.waterbilling.entity.WaterUsageEntry;
import com.water.waterbilling.repository.ApartmentRepository;
import com.water.waterbilling.repository.UserRepository;
import com.water.waterbilling.repository.WaterUsageRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommunityAdminService {

    private final UserRepository userRepository;
    private final ApartmentRepository apartmentRepository;
    private final WaterUsageRepository waterUsageRepository;
    private final PasswordEncoder passwordEncoder;

    public CommunityAdminService(UserRepository userRepository,
                                 ApartmentRepository apartmentRepository,
                                 WaterUsageRepository waterUsageRepository,
                                 PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.apartmentRepository = apartmentRepository;
        this.waterUsageRepository = waterUsageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String registerCommunityAdmin(CommunityAdminRegisterRequest request) {

        if(userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username already exists");
        }

        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");
        }

        // Create User
        User admin = new User();

        admin.setFullName(request.getFullName());
        admin.setEmail(request.getEmail());
        admin.setPhone(request.getPhone());
        admin.setUsername(request.getUsername());

        admin.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        admin.setRole("COMMUNITY_ADMIN");
        admin.setApproved(false);

        admin.setApartment(request.getApartment());


        User savedAdmin = userRepository.save(admin);

        // Create Apartment
        Apartment apartment = new Apartment();

        apartment.setApartmentName(request.getApartment());
        apartment.setAddress(request.getApartmentAddress());
        apartment.setCity(request.getCity());
        apartment.setState(request.getState());
        apartment.setPincode(request.getPincode());
        apartment.setTotalFlats(request.getTotalHouseholds());

        apartment.setCommunityAdmin(savedAdmin);
        apartment.setInviteToken(UUID.randomUUID().toString());

        apartmentRepository.save(apartment);

        return "Community Admin Registered Successfully";
    }

    /**
     * Returns only the residents belonging to the apartment/community
     * managed by the given Community Admin username.
     */
    public List<User> getResidentsForAdmin(String adminUsername) {

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Apartment apartment = apartmentRepository.findByCommunityAdmin(admin)
                .orElseThrow(() -> new RuntimeException("No apartment found for this admin"));

        String apartmentName = apartment.getApartmentName();

        return userRepository.findAll()
                .stream()
                .filter(u -> "RESIDENT".equals(u.getRole()))
                .filter(u -> apartmentName.equalsIgnoreCase(u.getApartment()))
                .toList();
    }

    /**
     * Super Admin drill-down: returns residents belonging to a specific
     * apartment, looked up by its ID rather than by the logged-in user.
     */
    public List<User> getResidentsByApartmentId(Long apartmentId) {

        Apartment apartment = apartmentRepository.findById(apartmentId)
                .orElseThrow(() -> new RuntimeException("Apartment not found"));

        String apartmentName = apartment.getApartmentName();

        return userRepository.findAll()
                .stream()
                .filter(u -> "RESIDENT".equals(u.getRole()))
                .filter(u -> apartmentName.equalsIgnoreCase(u.getApartment()))
                .toList();
    }

    /**
     * Returns the single apartment managed by the given Community Admin.
     */
    public Apartment getMyApartment(String adminUsername) {

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        return apartmentRepository.findByCommunityAdmin(admin)
                .orElseThrow(() -> new RuntimeException("No apartment found for this admin"));
    }

    /**
     * Updates editable details of the apartment managed by the given
     * Community Admin. The apartment name is intentionally NOT editable
     * here, since residents are matched to their community by name -
     * renaming it would silently break that link.
     */
    public Apartment updateMyApartment(String adminUsername, ApartmentDetailsRequest request) {

        Apartment apartment = getMyApartment(adminUsername);

        apartment.setAddress(request.getAddress());
        apartment.setCity(request.getCity());
        apartment.setState(request.getState());
        apartment.setPincode(request.getPincode());
        apartment.setTotalFlats(request.getTotalFlats());

        return apartmentRepository.save(apartment);
    }

    /**
     * Platform-wide counts for the Super Admin dashboard.
     */
    public PlatformStatsResponse getPlatformStats() {
        long totalCommunities = apartmentRepository.count();
        long totalResidents = userRepository.findAll()
                .stream()
                .filter(u -> "RESIDENT".equals(u.getRole()))
                .count();
        return new PlatformStatsResponse(totalCommunities, totalResidents);
    }

    /**
     * Every Community Admin still awaiting Super Admin approval, with
     * their apartment details attached for review.
     */
    public List<PendingAdminSummary> getPendingCommunityAdmins() {

        List<User> pendingAdmins = userRepository.findAll()
                .stream()
                .filter(u -> "COMMUNITY_ADMIN".equals(u.getRole()))
                .filter(u -> !Boolean.TRUE.equals(u.getApproved()))
                .toList();

        return pendingAdmins.stream()
                .map(admin -> {
                    Apartment apartment = apartmentRepository.findByCommunityAdmin(admin).orElse(null);
                    return new PendingAdminSummary(
                            admin.getId(),
                            admin.getFullName(),
                            admin.getEmail(),
                            admin.getPhone(),
                            apartment != null ? apartment.getApartmentName() : "—",
                            apartment != null ? apartment.getCity() : "—"
                    );
                })
                .toList();
    }

    /**
     * Super Admin approves a pending Community Admin, unlocking their
     * full dashboard.
     */
    public void approveCommunityAdmin(Long userId) {

        User admin = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!"COMMUNITY_ADMIN".equals(admin.getRole())) {
            throw new RuntimeException("This account is not a Community Admin");
        }

        admin.setApproved(true);
        userRepository.save(admin);
    }

    /**
     * Dashboard overview for a Community Admin: resident count, total
     * flats, today's community-wide usage, and a 7-day usage trend.
     */
    public CommunityStatsResponse getCommunityStats(String adminUsername) {

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Apartment apartment = apartmentRepository.findByCommunityAdmin(admin)
                .orElseThrow(() -> new RuntimeException("No apartment found for this admin"));

        String apartmentName = apartment.getApartmentName();

        List<String> residentUsernames = userRepository.findAll().stream()
                .filter(u -> "RESIDENT".equals(u.getRole()))
                .filter(u -> apartmentName.equalsIgnoreCase(u.getApartment()))
                .map(User::getUsername)
                .toList();

        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(6);

        List<WaterUsageEntry> allEntries = waterUsageRepository.findAll().stream()
                .filter(e -> residentUsernames.contains(e.getUsername()))
                .toList();

        double todayTotal = allEntries.stream()
                .filter(e -> e.getDate().isEqual(today))
                .mapToDouble(WaterUsageEntry::getLitresUsed)
                .sum();

        Map<LocalDate, Double> dailyTotals = allEntries.stream()
                .filter(e -> !e.getDate().isBefore(sevenDaysAgo))
                .collect(Collectors.groupingBy(WaterUsageEntry::getDate, Collectors.summingDouble(WaterUsageEntry::getLitresUsed)));

        DateTimeFormatter labelFormat = DateTimeFormatter.ofPattern("d MMM");

        List<CommunityStatsResponse.DailyUsagePoint> weeklyTrend = sevenDaysAgo.datesUntil(today.plusDays(1))
                .map(d -> new CommunityStatsResponse.DailyUsagePoint(d.format(labelFormat), dailyTotals.getOrDefault(d, 0.0)))
                .toList();

        return new CommunityStatsResponse(
                residentUsernames.size(),
                apartment.getTotalFlats(),
                todayTotal,
                weeklyTrend
        );
    }

    /**
     * Returns the logged-in Community Admin's invite token, generating
     * one if this apartment predates the invite-link feature.
     */
    public String getMyInviteToken(String adminUsername) {

        Apartment apartment = getMyApartment(adminUsername);

        if (apartment.getInviteToken() == null || apartment.getInviteToken().isBlank()) {
            apartment.setInviteToken(UUID.randomUUID().toString());
            apartmentRepository.save(apartment);
        }

        return apartment.getInviteToken();
    }

    /**
     * Public lookup: given an invite token, returns the apartment it
     * belongs to (or throws if the token is invalid). Used by the
     * resident-facing invite registration page.
     */
    public Apartment getApartmentByInviteToken(String token) {
        return apartmentRepository.findByInviteToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired invite link"));
    }

    // ---- Super Admin management actions ----

    private User getByIdAndRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!role.equals(user.getRole())) {
            throw new RuntimeException("This account is not a " + role);
        }
        return user;
    }

    public User updateCommunityAdmin(Long adminId, String fullName, String email, String phone) {
        User admin = getByIdAndRole(adminId, "COMMUNITY_ADMIN");
        admin.setFullName(fullName);
        admin.setEmail(email);
        admin.setPhone(phone);
        return userRepository.save(admin);
    }

    /**
     * Deletes a Community Admin and their linked apartment. Residents who
     * were registered under that apartment are NOT deleted - they simply
     * become unassigned (their apartment string no longer matches any
     * real community) so a Super Admin can reassign or remove them
     * separately rather than losing resident data silently.
     */
    public void deleteCommunityAdmin(Long adminId) {
        User admin = getByIdAndRole(adminId, "COMMUNITY_ADMIN");

        apartmentRepository.findByCommunityAdmin(admin)
                .ifPresent(apartmentRepository::delete);

        userRepository.delete(admin);
    }

    public User updateResident(Long residentId, String fullName, String email, String phone, String flatNumber) {
        User resident = getByIdAndRole(residentId, "RESIDENT");
        resident.setFullName(fullName);
        resident.setEmail(email);
        resident.setPhone(phone);
        resident.setFlatNumber(flatNumber);
        return userRepository.save(resident);
    }

    /**
     * Community Admin assigns (or updates) the physical water meter
     * number for one of their own residents. Deliberately manual, not
     * auto-generated - the value must match the actual meter installed
     * at that flat, which only the admin walking the site knows.
     * Blocked if the same meter number is already assigned to a
     * different resident, to prevent two flats from sharing one meter
     * by mistake.
     */
    public User assignMeterNumber(String adminUsername, Long residentId, String meterNumber) {

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        Apartment apartment = apartmentRepository.findByCommunityAdmin(admin)
                .orElseThrow(() -> new RuntimeException("No apartment found for this admin"));

        User resident = getByIdAndRole(residentId, "RESIDENT");

        if (!apartment.getApartmentName().equalsIgnoreCase(resident.getApartment())) {
            throw new RuntimeException("This resident does not belong to your community");
        }

        String trimmed = meterNumber == null ? null : meterNumber.trim();

        if (trimmed != null && !trimmed.isEmpty()) {
            String apartmentName = apartment.getApartmentName();

            boolean alreadyUsed = userRepository.findAll().stream()
                    .filter(u -> "RESIDENT".equals(u.getRole()))
                    .filter(u -> !u.getId().equals(resident.getId()))
                    .filter(u -> apartmentName.equalsIgnoreCase(u.getApartment()))
                    .anyMatch(u -> trimmed.equalsIgnoreCase(u.getMeterNumber()));

            if (alreadyUsed) {
                throw new RuntimeException("This meter number is already assigned to another resident in your community");
            }
        }

        resident.setMeterNumber(trimmed == null || trimmed.isEmpty() ? null : trimmed);
        return userRepository.save(resident);
    }

    /**
     * Convenience bulk action: fills in a sequential placeholder meter
     * number (MTR-{apartmentId}-{seq}) for every resident in the admin's
     * community that doesn't have one yet. Never overwrites an existing
     * value - admins can still edit any of these to the real physical
     * meter number afterward.
     */
    public int autoAssignMissingMeterNumbers(String adminUsername) {

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        Apartment apartment = apartmentRepository.findByCommunityAdmin(admin)
                .orElseThrow(() -> new RuntimeException("No apartment found for this admin"));

        String apartmentName = apartment.getApartmentName();

        List<User> residents = userRepository.findAll().stream()
                .filter(u -> "RESIDENT".equals(u.getRole()))
                .filter(u -> apartmentName.equalsIgnoreCase(u.getApartment()))
                .toList();

        long existingSeq = residents.stream()
                .filter(u -> u.getMeterNumber() != null && !u.getMeterNumber().isEmpty())
                .count();

        int assigned = 0;
        long nextSeq = existingSeq + 1;

        for (User resident : residents) {
            if (resident.getMeterNumber() != null && !resident.getMeterNumber().isEmpty()) {
                continue;
            }
            resident.setMeterNumber(String.format("MTR-%d-%03d", apartment.getId(), nextSeq));
            userRepository.save(resident);
            nextSeq++;
            assigned++;
        }

        return assigned;
    }

}