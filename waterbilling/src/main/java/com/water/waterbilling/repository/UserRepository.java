package com.water.waterbilling.repository;

import com.water.waterbilling.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {


    Optional<User> findByUsername(String username);


    boolean existsByUsername(String username);


    boolean existsByEmail(String email);


    // Fetch residents by apartment name
    List<User> findByApartmentAndRole(
            String apartment,
            String role
    );


    // Fetch all users belonging to an apartment
    List<User> findByApartment(
            String apartment
    );


}