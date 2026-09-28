package com.water.waterbilling.repository;

import com.water.waterbilling.entity.Apartment;
import com.water.waterbilling.entity.BillingCycle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BillingCycleRepository extends JpaRepository<BillingCycle, Long> {

    List<BillingCycle> findByApartmentOrderByStartDateDesc(Apartment apartment);

    boolean existsByApartmentAndStatus(Apartment apartment, String status);

}