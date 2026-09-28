package com.water.waterbilling.dto;

import java.util.List;

public class ConsumptionComparisonResponse {

    private String periodLabel;
    private double myTotalLitres;
    private double apartmentAverageLitres;
    private double apartmentMedianLitres;
    private int myRank;              // 1 = lowest usage (best conserver)
    private int totalHouseholds;
    private double percentBelowAverage; // positive = below average (good), negative = above
    private List<HouseholdBar> breakdown;

    public ConsumptionComparisonResponse() {}

    public static class HouseholdBar {
        private String label;   // "You" or "Flat A-12" or "Household 3" (anonymized)
        private double litres;
        private boolean isYou;

        public HouseholdBar() {}

        public HouseholdBar(String label, double litres, boolean isYou) {
            this.label = label;
            this.litres = litres;
            this.isYou = isYou;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public double getLitres() { return litres; }
        public void setLitres(double litres) { this.litres = litres; }
        public boolean isYou() { return isYou; }
        public void setYou(boolean you) { isYou = you; }
    }

    // Getters & Setters
    public String getPeriodLabel() { return periodLabel; }
    public void setPeriodLabel(String periodLabel) { this.periodLabel = periodLabel; }
    public double getMyTotalLitres() { return myTotalLitres; }
    public void setMyTotalLitres(double myTotalLitres) { this.myTotalLitres = myTotalLitres; }
    public double getApartmentAverageLitres() { return apartmentAverageLitres; }
    public void setApartmentAverageLitres(double apartmentAverageLitres) { this.apartmentAverageLitres = apartmentAverageLitres; }
    public double getApartmentMedianLitres() { return apartmentMedianLitres; }
    public void setApartmentMedianLitres(double apartmentMedianLitres) { this.apartmentMedianLitres = apartmentMedianLitres; }
    public int getMyRank() { return myRank; }
    public void setMyRank(int myRank) { this.myRank = myRank; }
    public int getTotalHouseholds() { return totalHouseholds; }
    public void setTotalHouseholds(int totalHouseholds) { this.totalHouseholds = totalHouseholds; }
    public double getPercentBelowAverage() { return percentBelowAverage; }
    public void setPercentBelowAverage(double percentBelowAverage) { this.percentBelowAverage = percentBelowAverage; }
    public List<HouseholdBar> getBreakdown() { return breakdown; }
    public void setBreakdown(List<HouseholdBar> breakdown) { this.breakdown = breakdown; }
}