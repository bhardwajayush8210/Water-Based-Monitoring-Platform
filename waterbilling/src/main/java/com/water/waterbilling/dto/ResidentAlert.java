package com.water.waterbilling.dto;

public class ResidentAlert {

    private String username;
    private String fullName;
    private String flatNumber;
    private String date;
    private double litresUsed;
    private double thresholdLitres;
    private String severity; // "WARNING" or "DANGER"

    public ResidentAlert() {
    }

    public ResidentAlert(String username, String fullName, String flatNumber, String date,
                         double litresUsed, double thresholdLitres, String severity) {
        this.username = username;
        this.fullName = fullName;
        this.flatNumber = flatNumber;
        this.date = date;
        this.litresUsed = litresUsed;
        this.thresholdLitres = thresholdLitres;
        this.severity = severity;
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getLitresUsed() {
        return litresUsed;
    }

    public void setLitresUsed(double litresUsed) {
        this.litresUsed = litresUsed;
    }

    public double getThresholdLitres() {
        return thresholdLitres;
    }

    public void setThresholdLitres(double thresholdLitres) {
        this.thresholdLitres = thresholdLitres;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }
}