package com.water.waterbilling.dto;

public class PlatformStatsResponse {

    private long totalCommunities;
    private long totalResidents;

    public PlatformStatsResponse() {
    }

    public PlatformStatsResponse(long totalCommunities, long totalResidents) {
        this.totalCommunities = totalCommunities;
        this.totalResidents = totalResidents;
    }

    public long getTotalCommunities() {
        return totalCommunities;
    }

    public void setTotalCommunities(long totalCommunities) {
        this.totalCommunities = totalCommunities;
    }

    public long getTotalResidents() {
        return totalResidents;
    }

    public void setTotalResidents(long totalResidents) {
        this.totalResidents = totalResidents;
    }
}