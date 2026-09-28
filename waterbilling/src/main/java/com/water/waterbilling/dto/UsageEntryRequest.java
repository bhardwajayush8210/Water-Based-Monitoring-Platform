package com.water.waterbilling.dto;

import java.time.LocalDate;

public class UsageEntryRequest {

    private LocalDate date;
    private Double litresUsed;

    public UsageEntryRequest() {
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getLitresUsed() {
        return litresUsed;
    }

    public void setLitresUsed(Double litresUsed) {
        this.litresUsed = litresUsed;
    }
}