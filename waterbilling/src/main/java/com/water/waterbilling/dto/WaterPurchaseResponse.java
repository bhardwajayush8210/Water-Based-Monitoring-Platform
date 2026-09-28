package com.water.waterbilling.dto;

import java.time.LocalDate;

public class WaterPurchaseResponse {

    private Long id;
    private String source;
    private LocalDate purchaseDate;
    private Double totalVolumeLitres;
    private Double totalCostInr;
    private Double unitCostInr; // totalCostInr / totalVolumeLitres
    private String notes;

    public WaterPurchaseResponse() {
    }

    public WaterPurchaseResponse(Long id, String source, LocalDate purchaseDate,
                                 Double totalVolumeLitres, Double totalCostInr,
                                 Double unitCostInr, String notes) {
        this.id = id;
        this.source = source;
        this.purchaseDate = purchaseDate;
        this.totalVolumeLitres = totalVolumeLitres;
        this.totalCostInr = totalCostInr;
        this.unitCostInr = unitCostInr;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Double getUnitCostInr() {
        return unitCostInr;
    }

    public void setUnitCostInr(Double unitCostInr) {
        this.unitCostInr = unitCostInr;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}