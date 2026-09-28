package com.water.waterbilling.repository;

import com.water.waterbilling.entity.Apartment;
import com.water.waterbilling.entity.WaterPurchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WaterPurchaseRepository extends JpaRepository<WaterPurchase, Long> {

    List<WaterPurchase> findByApartmentOrderByPurchaseDateDesc(Apartment apartment);

}