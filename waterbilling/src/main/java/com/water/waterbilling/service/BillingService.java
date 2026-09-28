package com.water.waterbilling.service;

import com.water.waterbilling.dto.MyBillResponse;
import com.water.waterbilling.dto.ResidentBillSummary;
import com.water.waterbilling.dto.TariffPlanRequest;
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
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
public class BillingService {

    private final TariffPlanRepository tariffPlanRepository;
    private final ApartmentRepository apartmentRepository;
    private final UserRepository userRepository;
    private final WaterUsageRepository waterUsageRepository;

    public BillingService(
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

    /**
     * Pure calculation: applies the tiered rate structure to a given
     * litres total. Usage up to the threshold is charged at tier 1;
     * anything beyond it is charged at tier 2.
     */
    public static double calculateBill(double totalLitres, TariffPlan plan) {
        if (plan == null || totalLitres <= 0) {
            return 0.0;
        }

        double threshold = plan.getTier1ThresholdLitres();

        if (totalLitres <= threshold) {
            return totalLitres * plan.getTier1RateInr();
        }

        double tier1Portion = threshold * plan.getTier1RateInr();
        double tier2Portion = (totalLitres - threshold) * plan.getTier2RateInr();
        return tier1Portion + tier2Portion;
    }

    private Apartment getApartmentForAdmin(String adminUsername) {
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        return apartmentRepository.findByCommunityAdmin(admin)
                .orElseThrow(() -> new RuntimeException("No apartment found for this admin"));
    }

    public TariffPlan getTariffPlan(String adminUsername) {
        Apartment apartment = getApartmentForAdmin(adminUsername);
        return tariffPlanRepository.findByApartment(apartment).orElse(null);
    }

    public TariffPlan updateTariffPlan(String adminUsername, TariffPlanRequest request) {

        Apartment apartment = getApartmentForAdmin(adminUsername);

        TariffPlan plan = tariffPlanRepository.findByApartment(apartment).orElseGet(() -> {
            TariffPlan newPlan = new TariffPlan();
            newPlan.setApartment(apartment);
            return newPlan;
        });

        plan.setTier1RateInr(request.getTier1RateInr());
        plan.setTier1ThresholdLitres(
                request.getTier1ThresholdLitres() != null ? request.getTier1ThresholdLitres() : 10000.0
        );
        plan.setTier2RateInr(request.getTier2RateInr());

        return tariffPlanRepository.save(plan);
    }

    /**
     * Billing preview for every resident in the admin's community, for
     * the current calendar month to date.
     */
    public List<ResidentBillSummary> getResidentBills(String adminUsername) {

        Apartment apartment = getApartmentForAdmin(adminUsername);
        TariffPlan plan = tariffPlanRepository.findByApartment(apartment).orElse(null);

        String apartmentName = apartment.getApartmentName();
        List<User> residents = userRepository.findAll().stream()
                .filter(u -> "RESIDENT".equals(u.getRole()))
                .filter(u -> apartmentName.equalsIgnoreCase(u.getApartment()))
                .toList();

        LocalDate monthStart = LocalDate.now().withDayOfMonth(1);
        LocalDate today = LocalDate.now();

        return residents.stream()
                .map(r -> {
                    double totalLitres = waterUsageRepository
                            .findByUsernameOrderByDateAsc(r.getUsername())
                            .stream()
                            .filter(e -> !e.getDate().isBefore(monthStart) && !e.getDate().isAfter(today))
                            .mapToDouble(WaterUsageEntry::getLitresUsed)
                            .sum();

                    double bill = calculateBill(totalLitres, plan);

                    return new ResidentBillSummary(r.getUsername(), r.getFullName(), r.getFlatNumber(), totalLitres, bill);
                })
                .toList();
    }

    /**
     * A resident's own current-month bill estimate, based on real usage
     * their Community Admin has logged and the community's tariff plan.
     */
    public MyBillResponse getMyBill(String residentUsername) {

        User resident = userRepository.findByUsername(residentUsername)
                .orElseThrow(() -> new RuntimeException("Resident not found"));

        Apartment apartment = apartmentRepository.findAll().stream()
                .filter(a -> a.getApartmentName().equalsIgnoreCase(resident.getApartment()))
                .findFirst()
                .orElse(null);

        TariffPlan plan = apartment != null
                ? tariffPlanRepository.findByApartment(apartment).orElse(null)
                : null;

        LocalDate monthStart = LocalDate.now().withDayOfMonth(1);
        LocalDate today = LocalDate.now();

        double totalLitres = waterUsageRepository
                .findByUsernameOrderByDateAsc(residentUsername)
                .stream()
                .filter(e -> !e.getDate().isBefore(monthStart) && !e.getDate().isAfter(today))
                .mapToDouble(WaterUsageEntry::getLitresUsed)
                .sum();

        double bill = calculateBill(totalLitres, plan);

        String periodLabel = today.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " " + today.getYear();

        return new MyBillResponse(
                periodLabel,
                totalLitres,
                bill,
                plan != null,
                plan != null ? plan.getTier1RateInr() : null,
                plan != null ? plan.getTier1ThresholdLitres() : null,
                plan != null ? plan.getTier2RateInr() : null
        );
    }

}