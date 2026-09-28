package com.water.waterbilling.dto;

import java.util.List;

public class CommunityStatsResponse {

    private long residentCount;
    private Integer totalFlats;
    private double todayTotalUsage;
    private List<DailyUsagePoint> weeklyTrend;

    public CommunityStatsResponse() {
    }

    public CommunityStatsResponse(long residentCount, Integer totalFlats,
                                  double todayTotalUsage, List<DailyUsagePoint> weeklyTrend) {
        this.residentCount = residentCount;
        this.totalFlats = totalFlats;
        this.todayTotalUsage = todayTotalUsage;
        this.weeklyTrend = weeklyTrend;
    }

    public long getResidentCount() {
        return residentCount;
    }

    public void setResidentCount(long residentCount) {
        this.residentCount = residentCount;
    }

    public Integer getTotalFlats() {
        return totalFlats;
    }

    public void setTotalFlats(Integer totalFlats) {
        this.totalFlats = totalFlats;
    }

    public double getTodayTotalUsage() {
        return todayTotalUsage;
    }

    public void setTodayTotalUsage(double todayTotalUsage) {
        this.todayTotalUsage = todayTotalUsage;
    }

    public List<DailyUsagePoint> getWeeklyTrend() {
        return weeklyTrend;
    }

    public void setWeeklyTrend(List<DailyUsagePoint> weeklyTrend) {
        this.weeklyTrend = weeklyTrend;
    }

    public static class DailyUsagePoint {
        private String date;
        private double total;

        public DailyUsagePoint() {
        }

        public DailyUsagePoint(String date, double total) {
            this.date = date;
            this.total = total;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public double getTotal() {
            return total;
        }

        public void setTotal(double total) {
            this.total = total;
        }
    }
}