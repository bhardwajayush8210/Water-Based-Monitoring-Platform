package com.water.waterbilling.controller;

import com.water.waterbilling.entity.Apartment;
import com.water.waterbilling.service.ApartmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apartments")
@CrossOrigin(origins = "http://localhost:5173")
public class ApartmentController {

    private final ApartmentService service;

    public ApartmentController(ApartmentService service) {
        this.service = service;
    }

    @PostMapping
    public Apartment createApartment(@RequestBody Apartment apartment) {
        return service.saveApartment(apartment);
    }

    @GetMapping
    public List<Apartment> getAllApartments() {
        return service.getAllApartments();
    }

    @PutMapping("/{id}")
    public Apartment updateApartment(@PathVariable Long id,
                                     @RequestBody Apartment apartment) {
        return service.updateApartment(id, apartment);
    }

    @DeleteMapping("/{id}")
    public String deleteApartment(@PathVariable Long id) {

        service.deleteApartment(id);

        return "Apartment Deleted Successfully";
    }
}