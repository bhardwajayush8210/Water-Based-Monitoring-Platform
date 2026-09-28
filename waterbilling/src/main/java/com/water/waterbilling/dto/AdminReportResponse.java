package com.water.waterbilling.dto;

import java.util.List;

public class AdminReportResponse {

    private int totalUsers;
    private int totalResidents;
    private int totalCommunityAdmins;
    private long pendingApprovals;
    private int totalCommunities;

    private double totalUsageLitres;
    private double totalRevenueInr;
    private double totalWaterPurchaseCostInr;

    private long openTickets;
    private long escalatedTickets;
    private long resolvedTickets;

    private List<MonthlyPoint> usageTrend;
    private List<MonthlyPoint> revenueTrend;
    private List<CommunityBar> communityBreakdown;

    public AdminReportResponse() {}

    public static class MonthlyPoint {
        private String label;
        private double value;

        public MonthlyPoint() {}
        public MonthlyPoint(String label, double value) {
            this.label = label;
            this.value = value;
        }
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public double getValue() { return value; }
        public void setValue(double value) { this.value = value; }
    }

    public static class CommunityBar {
        private String apartmentName;
        private int residentCount;
        private double totalUsageLitres;
        private double totalRevenueInr;
        private double totalWaterPurchaseCostInr;

        public CommunityBar() {}
        public CommunityBar(String apartmentName, int residentCount, double totalUsageLitres,
                            double totalRevenueInr, double totalWaterPurchaseCostInr) {
            this.apartmentName = apartmentName;
            this.residentCount = residentCount;
            this.totalUsageLitres = totalUsageLitres;
            this.totalRevenueInr = totalRevenueInr;
            this.totalWaterPurchaseCostInr = totalWaterPurchaseCostInr;
        }
        public String getApartmentName() { return apartmentName; }
        public void setApartmentName(String apartmentName) { this.apartmentName = apartmentName; }
        public int getResidentCount() { return residentCount; }
        public void setResidentCount(int residentCount) { this.residentCount = residentCount; }
        public double getTotalUsageLitres() { return totalUsageLitres; }
        public void setTotalUsageLitres(double totalUsageLitres) { this.totalUsageLitres = totalUsageLitres; }
        public double getTotalRevenueInr() { return totalRevenueInr; }
        public void setTotalRevenueInr(double totalRevenueInr) { this.totalRevenueInr = totalRevenueInr; }
        public double getTotalWaterPurchaseCostInr() { return totalWaterPurchaseCostInr; }
        public void setTotalWaterPurchaseCostInr(double totalWaterPurchaseCostInr) { this.totalWaterPurchaseCostInr = totalWaterPurchaseCostInr; }
    }

    public int getTotalUsers() { return totalUsers; }
    public void setTotalUsers(int totalUsers) { this.totalUsers = totalUsers; }
    public int getTotalResidents() { return totalResidents; }
    public void setTotalResidents(int totalResidents) { this.totalResidents = totalResidents; }
    public int getTotalCommunityAdmins() { return totalCommunityAdmins; }
    public void setTotalCommunityAdmins(int totalCommunityAdmins) { this.totalCommunityAdmins = totalCommunityAdmins; }
    public long getPendingApprovals() { return pendingApprovals; }
    public void setPendingApprovals(long pendingApprovals) { this.pendingApprovals = pendingApprovals; }
    public int getTotalCommunities() { return totalCommunities; }
    public void setTotalCommunities(int totalCommunities) { this.totalCommunities = totalCommunities; }
    public double getTotalUsageLitres() { return totalUsageLitres; }
    public void setTotalUsageLitres(double totalUsageLitres) { this.totalUsageLitres = totalUsageLitres; }
    public double getTotalRevenueInr() { return totalRevenueInr; }
    public void setTotalRevenueInr(double totalRevenueInr) { this.totalRevenueInr = totalRevenueInr; }
    public double getTotalWaterPurchaseCostInr() { return totalWaterPurchaseCostInr; }
    public void setTotalWaterPurchaseCostInr(double totalWaterPurchaseCostInr) { this.totalWaterPurchaseCostInr = totalWaterPurchaseCostInr; }
    public long getOpenTickets() { return openTickets; }
    public void setOpenTickets(long openTickets) { this.openTickets = openTickets; }
    public long getEscalatedTickets() { return escalatedTickets; }
    public void setEscalatedTickets(long escalatedTickets) { this.escalatedTickets = escalatedTickets; }
    public long getResolvedTickets() { return resolvedTickets; }
    public void setResolvedTickets(long resolvedTickets) { this.resolvedTickets = resolvedTickets; }
    public List<MonthlyPoint> getUsageTrend() { return usageTrend; }
    public void setUsageTrend(List<MonthlyPoint> usageTrend) { this.usageTrend = usageTrend; }
    public List<MonthlyPoint> getRevenueTrend() { return revenueTrend; }
    public void setRevenueTrend(List<MonthlyPoint> revenueTrend) { this.revenueTrend = revenueTrend; }
    public List<CommunityBar> getCommunityBreakdown() { return communityBreakdown; }
    public void setCommunityBreakdown(List<CommunityBar> communityBreakdown) { this.communityBreakdown = communityBreakdown; }
}