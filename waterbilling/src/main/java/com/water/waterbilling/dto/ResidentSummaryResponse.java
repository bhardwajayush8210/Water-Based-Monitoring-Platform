package com.water.waterbilling.dto;

public class ResidentSummaryResponse {

    private Long id;
    private String fullName;
    private String username;
    private String phone;
    private String flatNumber;
    private Double todayUsage;
    private Double weeklyTotalUsage;

    public ResidentSummaryResponse() {
    }

    public ResidentSummaryResponse(Long id, String fullName, String username, String phone,
                                   String flatNumber, Double todayUsage, Double weeklyTotalUsage) {
        this.id = id;
        this.fullName = fullName;
        this.username = username;
        this.phone = phone;
        this.flatNumber = flatNumber;
        this.todayUsage = todayUsage;
        this.weeklyTotalUsage = weeklyTotalUsage;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getFlatNumber() {
        return flatNumber;
    }

    public void setFlatNumber(String flatNumber) {
        this.flatNumber = flatNumber;
    }

    public Double getTodayUsage() {
        return todayUsage;
    }

    public void setTodayUsage(Double todayUsage) {
        this.todayUsage = todayUsage;
    }

    public Double getWeeklyTotalUsage() {
        return weeklyTotalUsage;
    }

    public void setWeeklyTotalUsage(Double weeklyTotalUsage) {
        this.weeklyTotalUsage = weeklyTotalUsage;
    }
}