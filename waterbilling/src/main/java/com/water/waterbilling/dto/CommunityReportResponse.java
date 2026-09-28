package com.water.waterbilling.dto;

import java.time.LocalDate;
import java.util.List;

public class CommunityReportResponse {

    private int totalResidents;
    private double totalUsageLitres;
    private double totalRevenueInr;
    private double totalWaterPurchaseCostInr;
    private double averageUsagePerHouseholdLitres;

    private long openTickets;
    private long inProgressTickets;
    private long resolvedTickets;
    private long escalatedTickets;

    private List<MonthlyPoint> usageTrend;
    private List<CyclePoint> revenueTrend;
    private List<ResidentBar> residentBreakdown;
    private List<ResidentBar> residentRevenueBreakdown;
    private List<CycleDetail> cycleDetails;
    private List<SourceBreakdown> purchaseBySource;

    public CommunityReportResponse() {}

    public static class MonthlyPoint {
        private String label;
        private double litres;

        public MonthlyPoint() {}
        public MonthlyPoint(String label, double litres) {
            this.label = label;
            this.litres = litres;
        }
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public double getLitres() { return litres; }
        public void setLitres(double litres) { this.litres = litres; }
    }

    public static class CyclePoint {
        private String label;
        private double totalInr;

        public CyclePoint() {}
        public CyclePoint(String label, double totalInr) {
            this.label = label;
            this.totalInr = totalInr;
        }
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public double getTotalInr() { return totalInr; }
        public void setTotalInr(double totalInr) { this.totalInr = totalInr; }
    }

    public static class ResidentBar {
        private String label;
        private double litres;

        public ResidentBar() {}
        public ResidentBar(String label, double litres) {
            this.label = label;
            this.litres = litres;
        }
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public double getLitres() { return litres; }
        public void setLitres(double litres) { this.litres = litres; }
    }

    public static class CycleDetail {
        private String periodLabel;
        private LocalDate startDate;
        private LocalDate endDate;
        private String status;
        private double totalBilledInr;
        private int residentCount;

        public CycleDetail() {}
        public CycleDetail(String periodLabel, LocalDate startDate, LocalDate endDate,
                           String status, double totalBilledInr, int residentCount) {
            this.periodLabel = periodLabel;
            this.startDate = startDate;
            this.endDate = endDate;
            this.status = status;
            this.totalBilledInr = totalBilledInr;
            this.residentCount = residentCount;
        }
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
    }

    public static class SourceBreakdown {
        private String source;
        private double totalCostInr;
        private double totalVolumeLitres;

        public SourceBreakdown() {}
        public SourceBreakdown(String source, double totalCostInr, double totalVolumeLitres) {
            this.source = source;
            this.totalCostInr = totalCostInr;
            this.totalVolumeLitres = totalVolumeLitres;
        }
        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        public double getTotalCostInr() { return totalCostInr; }
        public void setTotalCostInr(double totalCostInr) { this.totalCostInr = totalCostInr; }
        public double getTotalVolumeLitres() { return totalVolumeLitres; }
        public void setTotalVolumeLitres(double totalVolumeLitres) { this.totalVolumeLitres = totalVolumeLitres; }
    }

    public int getTotalResidents() { return totalResidents; }
    public void setTotalResidents(int totalResidents) { this.totalResidents = totalResidents; }
    public double getTotalUsageLitres() { return totalUsageLitres; }
    public void setTotalUsageLitres(double totalUsageLitres) { this.totalUsageLitres = totalUsageLitres; }
    public double getTotalRevenueInr() { return totalRevenueInr; }
    public void setTotalRevenueInr(double totalRevenueInr) { this.totalRevenueInr = totalRevenueInr; }
    public double getTotalWaterPurchaseCostInr() { return totalWaterPurchaseCostInr; }
    public void setTotalWaterPurchaseCostInr(double totalWaterPurchaseCostInr) { this.totalWaterPurchaseCostInr = totalWaterPurchaseCostInr; }
    public double getAverageUsagePerHouseholdLitres() { return averageUsagePerHouseholdLitres; }
    public void setAverageUsagePerHouseholdLitres(double v) { this.averageUsagePerHouseholdLitres = v; }
    public long getOpenTickets() { return openTickets; }
    public void setOpenTickets(long v) { this.openTickets = v; }
    public long getInProgressTickets() { return inProgressTickets; }
    public void setInProgressTickets(long v) { this.inProgressTickets = v; }
    public long getResolvedTickets() { return resolvedTickets; }
    public void setResolvedTickets(long v) { this.resolvedTickets = v; }
    public long getEscalatedTickets() { return escalatedTickets; }
    public void setEscalatedTickets(long v) { this.escalatedTickets = v; }
    public List<MonthlyPoint> getUsageTrend() { return usageTrend; }
    public void setUsageTrend(List<MonthlyPoint> usageTrend) { this.usageTrend = usageTrend; }
    public List<CyclePoint> getRevenueTrend() { return revenueTrend; }
    public void setRevenueTrend(List<CyclePoint> revenueTrend) { this.revenueTrend = revenueTrend; }
    public List<ResidentBar> getResidentBreakdown() { return residentBreakdown; }
    public void setResidentBreakdown(List<ResidentBar> residentBreakdown) { this.residentBreakdown = residentBreakdown; }
    public List<ResidentBar> getResidentRevenueBreakdown() { return residentRevenueBreakdown; }
    public void setResidentRevenueBreakdown(List<ResidentBar> v) { this.residentRevenueBreakdown = v; }
    public List<CycleDetail> getCycleDetails() { return cycleDetails; }
    public void setCycleDetails(List<CycleDetail> cycleDetails) { this.cycleDetails = cycleDetails; }
    public List<SourceBreakdown> getPurchaseBySource() { return purchaseBySource; }
    public void setPurchaseBySource(List<SourceBreakdown> v) { this.purchaseBySource = v; }
}