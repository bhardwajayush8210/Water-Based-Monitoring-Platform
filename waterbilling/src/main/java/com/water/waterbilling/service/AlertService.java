package com.water.waterbilling.service;

import com.water.waterbilling.dto.ResidentAlert;
import com.water.waterbilling.entity.Apartment;
import com.water.waterbilling.entity.TariffPlan;
import com.water.waterbilling.entity.User;
import com.water.waterbilling.entity.WaterUsageEntry;
import com.water.waterbilling.repository.ApartmentRepository;
import com.water.waterbilling.repository.TariffPlanRepository;
import com.water.waterbilling.repository.UserRepository;
import com.water.waterbilling.repository.WaterUsageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Service
public class AlertService {

    private static final double DEFAULT_THRESHOLD = 300.0;
    private static final int LOOKBACK_DAYS = 7;
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("d MMM");

    private final TariffPlanRepository tariffPlanRepository;
    private final ApartmentRepository apartmentRepository;
    private final UserRepository userRepository;
    private final WaterUsageRepository waterUsageRepository;

    public AlertService(
            TariffPlanRepository tariffPlanRepository,
            ApartmentRepository apartmentRepository,
            UserRepository userRepository,
            WaterUsageRepository waterUsageRepository
    ) {
        this.tariffPlanRepository = tariffPlanRepository;
        this.apartmentRepository = apartmentRepository;
        this.userRepository = userRepository;
        this.waterUsageRepository = waterUsageRepository;
    }

    private String severityFor(double litres, double threshold) {
        return litres > threshold * 1.5 ? "DANGER" : "WARNING";
    }

    /**
     * Every alert (last 7 days) across all residents in the given
     * Community Admin's apartment.
     */
    public List<ResidentAlert> getAlertsForAdmin(String adminUsername) {

        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Apartment apartment = apartmentRepository.findByCommunityAdmin(admin)
                .orElseThrow(() -> new RuntimeException("No apartment found for this admin"));

        double threshold = tariffPlanRepository.findByApartment(apartment)
                .map(TariffPlan::getDailyAlertThresholdLitres)
                .orElse(DEFAULT_THRESHOLD);

        String apartmentName = apartment.getApartmentName();
        List<User> residents = userRepository.findAll().stream()
                .filter(u -> "RESIDENT".equals(u.getRole()))
                .filter(u -> apartmentName.equalsIgnoreCase(u.getApartment()))
                .toList();

        LocalDate cutoff = LocalDate.now().minusDays(LOOKBACK_DAYS - 1);

        return residents.stream()
                .flatMap(r -> waterUsageRepository.findByUsernameOrderByDateAsc(r.getUsername()).stream()
                        .filter(e -> !e.getDate().isBefore(cutoff))
                        .filter(e -> e.getLitresUsed() > threshold)
                        .map(e -> new ResidentAlert(
                                r.getUsername(),
                                r.getFullName(),
                                r.getFlatNumber(),
                                e.getDate().format(DATE_FORMAT),
                                e.getLitresUsed(),
                                threshold,
                                severityFor(e.getLitresUsed(), threshold)
                        )))
                .sorted(Comparator.comparingDouble(ResidentAlert::getLitresUsed).reversed())
                .toList();
    }

    /**
     * A single resident's own alerts (last 7 days), using their
     * community's configured threshold.
     */
    public List<ResidentAlert> getAlertsForResident(String residentUsername) {

        User resident = userRepository.findByUsername(residentUsername)
                .orElseThrow(() -> new RuntimeException("Resident not found"));

        Apartment apartment = apartmentRepository.findAll().stream()
                .filter(a -> a.getApartmentName().equalsIgnoreCase(resident.getApartment()))
                .findFirst()
                .orElse(null);

        double threshold = apartment != null
                ? tariffPlanRepository.findByApartment(apartment)
                  .map(TariffPlan::getDailyAlertThresholdLitres)
                  .orElse(DEFAULT_THRESHOLD)
                : DEFAULT_THRESHOLD;

        LocalDate cutoff = LocalDate.now().minusDays(LOOKBACK_DAYS - 1);

        return waterUsageRepository.findByUsernameOrderByDateAsc(residentUsername).stream()
                .filter(e -> !e.getDate().isBefore(cutoff))
                .filter(e -> e.getLitresUsed() > threshold)
                .map(e -> new ResidentAlert(
                        resident.getUsername(),
                        resident.getFullName(),
                        resident.getFlatNumber(),
                        e.getDate().format(DATE_FORMAT),
                        e.getLitresUsed(),
                        threshold,
                        severityFor(e.getLitresUsed(), threshold)
                ))
                .sorted(Comparator.comparing(ResidentAlert::getDate).reversed())
                .toList();
    }

    /**
     * Gets (or lazily creates with sensible defaults) the alert threshold
     * for a Community Admin's apartment.
     */
    public double getAlertThreshold(String adminUsername) {
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        Apartment apartment = apartmentRepository.findByCommunityAdmin(admin)
                .orElseThrow(() -> new RuntimeException("No apartment found for this admin"));

        return tariffPlanRepository.findByApartment(apartment)
                .map(TariffPlan::getDailyAlertThresholdLitres)
                .orElse(DEFAULT_THRESHOLD);
    }

    /**
     * Updates the alert threshold. If no tariff plan exists yet, creates
     * one with placeholder rates (0) so the alert threshold can be set
     * independently of billing configuration - the Community Admin can
     * still set real rates later via the Billing page.
     */
    public double updateAlertThreshold(String adminUsername, double newThreshold) {
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        Apartment apartment = apartmentRepository.findByCommunityAdmin(admin)
                .orElseThrow(() -> new RuntimeException("No apartment found for this admin"));

        TariffPlan plan = tariffPlanRepository.findByApartment(apartment).orElseGet(() -> {
            TariffPlan newPlan = new TariffPlan();
            newPlan.setApartment(apartment);
            newPlan.setTier1RateInr(0.0);
            newPlan.setTier2RateInr(0.0);
            return newPlan;
        });

        plan.setDailyAlertThresholdLitres(newThreshold);
        tariffPlanRepository.save(plan);

        return newThreshold;
    }

}