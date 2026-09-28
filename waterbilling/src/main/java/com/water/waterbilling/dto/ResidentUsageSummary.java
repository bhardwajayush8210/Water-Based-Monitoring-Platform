package com.water.waterbilling.dto;

public class ResidentUsageSummary {

    private String username;
    private String fullName;
    private String flatNumber;
    private Double todayLitres; // null if not logged yet today

    public ResidentUsageSummary() {
    }

    public ResidentUsageSummary(String username, String fullName, String flatNumber, Double todayLitres) {
        this.username = username;
        this.fullName = fullName;
        this.flatNumber = flatNumber;
        this.todayLitres = todayLitres;
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

    public Double getTodayLitres() {
        return todayLitres;
    }

    public void setTodayLitres(Double todayLitres) {
        this.todayLitres = todayLitres;
    }
}