package com.water.waterbilling.dto;

import java.time.LocalDate;

public class BillingOverviewResponse {

    private Long cycleId;
    private String apartmentName;
    private String communityAdminName;
    private String communityAdminUsername;
    private String periodLabel;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private double totalBilledInr;
    private int residentCount;
    private int invoiceCount;

    public BillingOverviewResponse() {}

    public Long getCycleId() { return cycleId; }
    public void setCycleId(Long cycleId) { this.cycleId = cycleId; }
    public String getApartmentName() { return apartmentName; }
    public void setApartmentName(String apartmentName) { this.apartmentName = apartmentName; }
    public String getCommunityAdminName() { return communityAdminName; }
    public void setCommunityAdminName(String communityAdminName) { this.communityAdminName = communityAdminName; }
    public String getCommunityAdminUsername() { return communityAdminUsername; }
    public void setCommunityAdminUsername(String communityAdminUsername) { this.communityAdminUsername = communityAdminUsername; }
    public String getPeriodLabel() { return periodLabel; }
    public void setPeriodLabel(String periodLabel) { this.periodLabel = periodLabel; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public double getTotalBilledInr() { return totalBilledInr; }
    public void setTotalBilledInr(double totalBilledInr) { this.totalBilledInr = totalBilledInr; }
    public int getResidentCount() { return residentCount; }
    public void setResidentCount(int residentCount) { this.residentCount = residentCount; }
    public int getInvoiceCount() { return invoiceCount; }
    public void setInvoiceCount(int invoiceCount) { this.invoiceCount = invoiceCount; }
}