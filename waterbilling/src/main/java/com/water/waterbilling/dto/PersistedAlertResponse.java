package com.water.waterbilling.dto;

public class PersistedAlertResponse {

    private Long id;
    private String residentUsername;
    private String fullName;
    private String flatNumber;
    private String alertType;
    private String date;
    private double litresUsed;
    private double referenceValue;
    private String message;
    private boolean isRead;

    public PersistedAlertResponse() {
    }

    public PersistedAlertResponse(Long id, String residentUsername, String fullName, String flatNumber,
                                  String alertType, String date, double litresUsed,
                                  double referenceValue, String message, boolean isRead) {
        this.id = id;
        this.residentUsername = residentUsername;
        this.fullName = fullName;
        this.flatNumber = flatNumber;
        this.alertType = alertType;
        this.date = date;
        this.litresUsed = litresUsed;
        this.referenceValue = referenceValue;
        this.message = message;
        this.isRead = isRead;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getResidentUsername() {
        return residentUsername;
    }

    public void setResidentUsername(String residentUsername) {
        this.residentUsername = residentUsername;
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

    public String getAlertType() {
        return alertType;
    }

    public void setAlertType(String alertType) {
        this.alertType = alertType;
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

    public double getReferenceValue() {
        return referenceValue;
    }

    public void setReferenceValue(double referenceValue) {
        this.referenceValue = referenceValue;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }
}