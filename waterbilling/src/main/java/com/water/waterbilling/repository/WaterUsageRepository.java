package com.water.waterbilling.repository;

import com.water.waterbilling.entity.WaterUsageEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WaterUsageRepository extends JpaRepository<WaterUsageEntry, Long> {

    List<WaterUsageEntry> findByUsernameOrderByDateAsc(String username);

    Optional<WaterUsageEntry> findByUsernameAndDate(String username, LocalDate date);

    List<WaterUsageEntry> findByUsernameInOrderByDateAsc(List<String> usernames);

    // ADDED THIS METHOD for current month bill calculations
    List<WaterUsageEntry> findByUsernameAndDateBetween(String username, LocalDate startDate, LocalDate endDate);

}