package com.water.waterbilling.repository;

import com.water.waterbilling.entity.Apartment;
import com.water.waterbilling.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApartmentRepository extends JpaRepository<Apartment, Long> {

    Optional<Apartment> findByCommunityAdmin(User communityAdmin);

    Optional<Apartment> findByInviteToken(String inviteToken);
    Optional<Apartment> findByApartmentName(String apartmentName);

}