package com.water.waterbilling.dto;

import java.time.LocalDate;

public class OpenCycleRequest {

    private String periodLabel;
    private LocalDate startDate;
    private LocalDate endDate;

    public OpenCycleRequest() {
    }

    public String getPeriodLabel() {
        return periodLabel;
    }

    public void setPeriodLabel(String periodLabel) {
        this.periodLabel = periodLabel;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}