package com.water.waterbilling.dto;

public class LoginResponse {

    private String token;
    private String role;
    private String username;
    private String message;
    private Boolean approved;

    public LoginResponse() {
    }

    public LoginResponse(String token, String role, String username, String message, Boolean approved) {
        this.token = token;
        this.role = role;
        this.username = username;
        this.message = message;
        this.approved = approved;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }
}