package com.water.waterbilling.dto;

public class InvoiceResponse {

    private Long id;
    private String periodLabel;
    private String cycleStatus;
    private String residentUsername;
    private String residentFullName;
    private String flatNumber;
    private double litresUsed;
    private double baseChargeInr;
    private double sharedAreaAllocationInr;
    private double adjustmentInr;
    private String adjustmentReason;
    private double totalInr;
    private String meterNumber;

    public InvoiceResponse() {
    }

    public InvoiceResponse(Long id, String periodLabel, String cycleStatus, String residentUsername,
                           String residentFullName, String flatNumber,String meterNumber, double litresUsed,
                           double baseChargeInr, double sharedAreaAllocationInr,
                           double adjustmentInr, String adjustmentReason, double totalInr) {
        this.id = id;
        this.periodLabel = periodLabel;
        this.cycleStatus = cycleStatus;
        this.residentUsername = residentUsername;
        this.residentFullName = residentFullName;
        this.flatNumber = flatNumber;
        this.meterNumber= meterNumber;
        this.litresUsed = litresUsed;
        this.baseChargeInr = baseChargeInr;
        this.sharedAreaAllocationInr = sharedAreaAllocationInr;
        this.adjustmentInr = adjustmentInr;
        this.adjustmentReason = adjustmentReason;
        this.totalInr = totalInr;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPeriodLabel() {
        return periodLabel;
    }

    public void setPeriodLabel(String periodLabel) {
        this.periodLabel = periodLabel;
    }

    public String getCycleStatus() {
        return cycleStatus;
    }

    public void setCycleStatus(String cycleStatus) {
        this.cycleStatus = cycleStatus;
    }

    public String getResidentUsername() {
        return residentUsername;
    }

    public void setResidentUsername(String residentUsername) {
        this.residentUsername = residentUsername;
    }

    public String getResidentFullName() {
        return residentFullName;
    }

    public void setResidentFullName(String residentFullName) {
        this.residentFullName = residentFullName;
    }

    public String getFlatNumber() {
        return flatNumber;
    }

    public void setFlatNumber(String flatNumber) {
        this.flatNumber = flatNumber;
    }

    public double getLitresUsed() {
        return litresUsed;
    }

    public void setLitresUsed(double litresUsed) {
        this.litresUsed = litresUsed;
    }

    public double getBaseChargeInr() {
        return baseChargeInr;
    }

    public void setBaseChargeInr(double baseChargeInr) {
        this.baseChargeInr = baseChargeInr;
    }

    public double getSharedAreaAllocationInr() {
        return sharedAreaAllocationInr;
    }

    public void setSharedAreaAllocationInr(double sharedAreaAllocationInr) {
        this.sharedAreaAllocationInr = sharedAreaAllocationInr;
    }

    public double getAdjustmentInr() {
        return adjustmentInr;
    }

    public void setAdjustmentInr(double adjustmentInr) {
        this.adjustmentInr = adjustmentInr;
    }

    public String getAdjustmentReason() {
        return adjustmentReason;
    }

    public void setAdjustmentReason(String adjustmentReason) {
        this.adjustmentReason = adjustmentReason;
    }

    public double getTotalInr() {
        return totalInr;
    }

    public void setTotalInr(double totalInr) {
        this.totalInr = totalInr;
    }

    public String getMeterNumber() {
        return meterNumber;
    }

    public void setMeterNumber(String meterNumber) {
        this.meterNumber = meterNumber;
    }
}