package com.water.waterbilling.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "billing_cycle_id", nullable = false)
    private BillingCycle billingCycle;

    @Column(name = "resident_username", nullable = false)
    private String residentUsername;

    // Snapshotted at finalize time so the historical record never
    // silently changes even if the resident's profile is edited later.
    @Column(name = "resident_full_name")
    private String residentFullName;

    @Column(name = "flat_number")
    private String flatNumber;

    @Column(name = "litres_used", nullable = false)
    private double litresUsed;

    // Tiered water charge based on this resident's own metered usage
    @Column(name = "base_charge_inr", nullable = false)
    private double baseChargeInr;

    // This resident's proportional share of bulk water purchase costs
    // (tanker/municipal) recorded during the cycle period, split by
    // metered usage share - shared infrastructure cost, not personal use.
    @Column(name = "shared_area_allocation_inr", nullable = false)
    private double sharedAreaAllocationInr;

    // Manual correction the Community Admin can apply before archiving
    // (e.g. a billing dispute, a discount, a late fee)
    @Column(name = "adjustment_inr", nullable = false)
    private double adjustmentInr = 0.0;

    @Column(name = "adjustment_reason")
    private String adjustmentReason;

    @Column(name = "total_inr", nullable = false)
    private double totalInr;

    @Column(name = "meter_number")
    private String meterNumber;

    public Invoice() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BillingCycle getBillingCycle() {
        return billingCycle;
    }

    public void setBillingCycle(BillingCycle billingCycle) {
        this.billingCycle = billingCycle;
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