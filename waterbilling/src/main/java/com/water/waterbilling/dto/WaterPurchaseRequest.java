package com.water.waterbilling.dto;

import java.time.LocalDate;

public class WaterPurchaseRequest {

    private String source;
    private LocalDate purchaseDate;
    private Double totalVolumeLitres;
    private Double totalCostInr;
    private String notes;

    public WaterPurchaseRequest() {
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
}