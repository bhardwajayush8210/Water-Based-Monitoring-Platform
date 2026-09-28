package com.water.waterbilling.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tariff_plans")
public class TariffPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "apartment_id", unique = true)
    private Apartment apartment;

    // Rate (Rs per litre) applied to usage up to tier1ThresholdLitres
    @Column(nullable = false)
    private Double tier1RateInr;

    // Litre threshold at which the higher rate kicks in (default 10,000 L = 10 kL)
    @Column(nullable = false)
    private Double tier1ThresholdLitres = 10000.0;

    // Rate (Rs per litre) applied to usage beyond the threshold
    @Column(nullable = false)
    private Double tier2RateInr;

    // Single-day litres threshold above which a resident's usage is
    // flagged as an alert. Defaults to a reasonable per-household value.
    @Column(nullable = false)
    private Double dailyAlertThresholdLitres = 300.0;

    public TariffPlan() {
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

    public Double getTier1RateInr() {
        return tier1RateInr;
    }

    public void setTier1RateInr(Double tier1RateInr) {
        this.tier1RateInr = tier1RateInr;
    }

    public Double getTier1ThresholdLitres() {
        return tier1ThresholdLitres;
    }

    public void setTier1ThresholdLitres(Double tier1ThresholdLitres) {
        this.tier1ThresholdLitres = tier1ThresholdLitres;
    }

    public Double getTier2RateInr() {
        return tier2RateInr;
    }

    public void setTier2RateInr(Double tier2RateInr) {
        this.tier2RateInr = tier2RateInr;
    }

    public Double getDailyAlertThresholdLitres() {
        return dailyAlertThresholdLitres;
    }

    public void setDailyAlertThresholdLitres(Double dailyAlertThresholdLitres) {
        this.dailyAlertThresholdLitres = dailyAlertThresholdLitres;
    }
}