package com.water.waterbilling.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "water_purchases")
public class WaterPurchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "apartment_id", nullable = false)
    private Apartment apartment;

    // "TANKER", "MUNICIPAL", or "OTHER"
    @Column(nullable = false)
    private String source;

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @Column(name = "total_volume_litres", nullable = false)
    private Double totalVolumeLitres;

    @Column(name = "total_cost_inr", nullable = false)
    private Double totalCostInr;

    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public WaterPurchase() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Apartment getApartment() {
        return apartment;
    }

    public void setApartment(Apartment apartment) {
        this.apartment = apartment;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public Double getTotalVolumeLitres() {
        return totalVolumeLitres;
    }

    public void setTotalVolumeLitres(Double totalVolumeLitres) {
        this.totalVolumeLitres = totalVolumeLitres;
    }

    public Double getTotalCostInr() {
        return totalCostInr;
    }

    public void setTotalCostInr(Double totalCostInr) {
        this.totalCostInr = totalCostInr;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}