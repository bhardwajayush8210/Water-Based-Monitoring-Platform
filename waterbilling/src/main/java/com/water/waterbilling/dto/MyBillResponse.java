package com.water.waterbilling.dto;



public class MyBillResponse {



    private String periodLabel;

    private double totalLitres;

    private double billAmount;

    private boolean tariffConfigured;

    private Double tier1RateInr;

    private Double tier1ThresholdLitres;

    private Double tier2RateInr;



    public MyBillResponse() {

    }



    public MyBillResponse(

            String periodLabel,

            double totalLitres,

            double billAmount,

            boolean tariffConfigured,

            Double tier1RateInr,

            Double tier1ThresholdLitres,

            Double tier2RateInr

    ) {

        this.periodLabel = periodLabel;

        this.totalLitres = totalLitres;

        this.billAmount = billAmount;

        this.tariffConfigured = tariffConfigured;

        this.tier1RateInr = tier1RateInr;

        this.tier1ThresholdLitres = tier1ThresholdLitres;

        this.tier2RateInr = tier2RateInr;

    }



    public String getPeriodLabel() {

        return periodLabel;

    }



    public void setPeriodLabel(String periodLabel) {

        this.periodLabel = periodLabel;

    }



    public double getTotalLitres() {

        return totalLitres;

    }



    public void setTotalLitres(double totalLitres) {

        this.totalLitres = totalLitres;

    }



    public double getBillAmount() {

        return billAmount;

    }



    public void setBillAmount(double billAmount) {

        this.billAmount = billAmount;

    }



    public boolean isTariffConfigured() {

        return tariffConfigured;

    }



    public void setTariffConfigured(boolean tariffConfigured) {

        this.tariffConfigured = tariffConfigured;

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

}

