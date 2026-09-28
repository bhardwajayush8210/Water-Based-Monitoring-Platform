package com.water.waterbilling.repository;

import com.water.waterbilling.entity.Apartment;
import com.water.waterbilling.entity.PersistedAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PersistedAlertRepository extends JpaRepository<PersistedAlert, Long> {

    List<PersistedAlert> findByApartmentOrderByCreatedAtDesc(Apartment apartment);

    List<PersistedAlert> findByResidentUsernameOrderByCreatedAtDesc(String residentUsername);

    boolean existsByResidentUsernameAndDateAndAlertType(String residentUsername, LocalDate date, String alertType);

}