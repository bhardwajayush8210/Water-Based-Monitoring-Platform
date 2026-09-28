package com.water.waterbilling.dto;

public class ResidentBillSummary {

    private String username;
    private String fullName;
    private String flatNumber;
    private double periodLitres;
    private double billAmount;

    public ResidentBillSummary() {
    }

    public ResidentBillSummary(String username, String fullName, String flatNumber, double periodLitres, double billAmount) {
        this.username = username;
        this.fullName = fullName;
        this.flatNumber = flatNumber;
        this.periodLitres = periodLitres;
        this.billAmount = billAmount;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getFlatNumber() {
        return flatNumber;
    }

    public void setFlatNumber(String flatNumber) {
        this.flatNumber = flatNumber;
    }

    public double getPeriodLitres() {
        return periodLitres;
    }

    public void setPeriodLitres(double periodLitres) {
        this.periodLitres = periodLitres;
    }

    public double getBillAmount() {
        return billAmount;
    }

    public void setBillAmount(double billAmount) {
        this.billAmount = billAmount;
    }
}