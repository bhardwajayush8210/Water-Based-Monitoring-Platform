package com.water.waterbilling.dto;

public class InviteResidentRequest {

    private String email;

    public InviteResidentRequest() {
    }

    public InviteResidentRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}