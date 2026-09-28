package com.water.waterbilling.repository;

import com.water.waterbilling.entity.Apartment;
import com.water.waterbilling.entity.TariffPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TariffPlanRepository extends JpaRepository<TariffPlan, Long> {

    Optional<TariffPlan> findByApartment(Apartment apartment);

}