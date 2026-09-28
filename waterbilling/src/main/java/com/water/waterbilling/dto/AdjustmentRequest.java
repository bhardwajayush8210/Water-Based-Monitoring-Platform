package com.water.waterbilling.dto;

public class AdjustmentRequest {

    private Double adjustmentInr;
    private String reason;

    public AdjustmentRequest() {
    }

    public Double getAdjustmentInr() {
        return adjustmentInr;
    }

    public void setAdjustmentInr(Double adjustmentInr) {
        this.adjustmentInr = adjustmentInr;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}