package com.water.waterbilling.service;

import com.water.waterbilling.entity.Apartment;
import com.water.waterbilling.repository.ApartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApartmentService {

    private final ApartmentRepository repository;

    public ApartmentService(ApartmentRepository repository) {
        this.repository = repository;
    }

    public Apartment saveApartment(Apartment apartment) {
        return repository.save(apartment);
    }

    public List<Apartment> getAllApartments() {
        return repository.findAll();
    }

    public Apartment updateApartment(Long id, Apartment apartment) {

        Apartment existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apartment not found"));

        existing.setApartmentName(apartment.getApartmentName());
        existing.setAddress(apartment.getAddress());
        existing.setTotalFlats(apartment.getTotalFlats());

        return repository.save(existing);
    }

    public void deleteApartment(Long id) {
        repository.deleteById(id);
    }
}