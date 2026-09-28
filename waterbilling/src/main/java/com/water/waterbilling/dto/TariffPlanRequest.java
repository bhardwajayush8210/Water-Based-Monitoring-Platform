package com.water.waterbilling.dto;

public class TariffPlanRequest {

    private Double tier1RateInr;
    private Double tier1ThresholdLitres;
    private Double tier2RateInr;
    private Double dailyAlertThresholdLitres;

    public TariffPlanRequest() {
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