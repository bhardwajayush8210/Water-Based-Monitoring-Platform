package com.water.waterbilling.service;

import com.water.waterbilling.dto.WaterPurchaseRequest;
import com.water.waterbilling.dto.WaterPurchaseResponse;
import com.water.waterbilling.entity.Apartment;
import com.water.waterbilling.entity.User;
import com.water.waterbilling.entity.WaterPurchase;
import com.water.waterbilling.repository.ApartmentRepository;
import com.water.waterbilling.repository.UserRepository;
import com.water.waterbilling.repository.WaterPurchaseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class WaterPurchaseService {

    private final WaterPurchaseRepository repository;
    private final UserRepository userRepository;
    private final ApartmentRepository apartmentRepository;

    public WaterPurchaseService(
            WaterPurchaseRepository repository,
            UserRepository userRepository,
            ApartmentRepository apartmentRepository
    ) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.apartmentRepository = apartmentRepository;
    }

    private Apartment getApartmentForAdmin(String adminUsername) {
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        return apartmentRepository.findByCommunityAdmin(admin)
                .orElseThrow(() -> new RuntimeException("No apartment found for this admin"));
    }

    private WaterPurchaseResponse toResponse(WaterPurchase p) {
        Double unitCost = (p.getTotalVolumeLitres() != null && p.getTotalVolumeLitres() > 0)
                ? p.getTotalCostInr() / p.getTotalVolumeLitres()
                : 0.0;
        return new WaterPurchaseResponse(
                p.getId(), p.getSource(), p.getPurchaseDate(),
                p.getTotalVolumeLitres(), p.getTotalCostInr(), unitCost, p.getNotes()
        );
    }

    public WaterPurchaseResponse addPurchase(String adminUsername, WaterPurchaseRequest request) {
        Apartment apartment = getApartmentForAdmin(adminUsername);

        WaterPurchase purchase = new WaterPurchase();
        purchase.setApartment(apartment);
        purchase.setSource(request.getSource());
        purchase.setPurchaseDate(request.getPurchaseDate());
        purchase.setTotalVolumeLitres(request.getTotalVolumeLitres());
        purchase.setTotalCostInr(request.getTotalCostInr());
        purchase.setNotes(request.getNotes());

        return toResponse(repository.save(purchase));
    }

    public List<WaterPurchaseResponse> getPurchasesForAdmin(String adminUsername) {
        Apartment apartment = getApartmentForAdmin(adminUsername);
        return repository.findByApartmentOrderByPurchaseDateDesc(apartment)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void deletePurchase(String adminUsername, Long purchaseId) {
        Apartment apartment = getApartmentForAdmin(adminUsername);

        WaterPurchase purchase = repository.findById(purchaseId)
                .orElseThrow(() -> new RuntimeException("Purchase record not found"));

        if (!purchase.getApartment().getId().equals(apartment.getId())) {
            throw new RuntimeException("This purchase record does not belong to your community");
        }

        repository.deleteById(purchaseId);
    }

    /**
     * Total volume and cost purchased so far this calendar month, plus
     * the resulting blended unit cost - used as the top summary cards
     * and as the cost pool for the consumption-based distribution report.
     */
    public Map<String, Double> getThisMonthSummary(String adminUsername) {
        Apartment apartment = getApartmentForAdmin(adminUsername);
        LocalDate monthStart = LocalDate.now().withDayOfMonth(1);

        List<WaterPurchase> thisMonth = repository.findByApartmentOrderByPurchaseDateDesc(apartment)
                .stream()
                .filter(p -> !p.getPurchaseDate().isBefore(monthStart))
                .toList();

        double totalVolume = thisMonth.stream().mapToDouble(WaterPurchase::getTotalVolumeLitres).sum();
        double totalCost = thisMonth.stream().mapToDouble(WaterPurchase::getTotalCostInr).sum();
        double blendedUnitCost = totalVolume > 0 ? totalCost / totalVolume : 0.0;

        return Map.of(
                "totalVolumeLitres", totalVolume,
                "totalCostInr", totalCost,
                "blendedUnitCostInr", blendedUnitCost
        );
    }

}