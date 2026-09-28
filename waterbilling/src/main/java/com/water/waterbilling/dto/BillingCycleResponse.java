package com.water.waterbilling.dto;

public class BillingCycleResponse {

    private Long id;
    private String periodLabel;
    private String startDate;
    private String endDate;
    private String status;
    private Integer invoiceCount;
    private Double totalBilledInr; // null until finalized
    private String finalizedAt;
    private String archivedAt;

    public BillingCycleResponse() {
    }

    public BillingCycleResponse(Long id, String periodLabel, String startDate, String endDate,
                                String status, Integer invoiceCount, Double totalBilledInr,
                                String finalizedAt, String archivedAt) {
        this.id = id;
        this.periodLabel = periodLabel;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.invoiceCount = invoiceCount;
        this.totalBilledInr = totalBilledInr;
        this.finalizedAt = finalizedAt;
        this.archivedAt = archivedAt;
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

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getInvoiceCount() {
        return invoiceCount;
    }

    public void setInvoiceCount(Integer invoiceCount) {
        this.invoiceCount = invoiceCount;
    }

    public Double getTotalBilledInr() {
        return totalBilledInr;
    }

    public void setTotalBilledInr(Double totalBilledInr) {
        this.totalBilledInr = totalBilledInr;
    }

    public String getFinalizedAt() {
        return finalizedAt;
    }

    public void setFinalizedAt(String finalizedAt) {
        this.finalizedAt = finalizedAt;
    }

    public String getArchivedAt() {
        return archivedAt;
    }

    public void setArchivedAt(String archivedAt) {
        this.archivedAt = archivedAt;
    }
}