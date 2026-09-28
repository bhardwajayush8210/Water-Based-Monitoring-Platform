package com.water.waterbilling.dto;

public class UserProfileResponse {

    private String fullName;
    private String username;
    private String email;
    private String phone;
    private String role;
    private String apartment;
    private String flatNumber;
    private String meterNumber;

    public UserProfileResponse() {}

    public UserProfileResponse(String fullName, String username, String email, String phone,
                               String role, String apartment, String flatNumber, String meterNumber) {
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.apartment = apartment;
        this.flatNumber = flatNumber;
        this.meterNumber = meterNumber;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getApartment() { return apartment; }
    public void setApartment(String apartment) { this.apartment = apartment; }
    public String getFlatNumber() { return flatNumber; }
    public void setFlatNumber(String flatNumber) { this.flatNumber = flatNumber; }
    public String getMeterNumber() { return meterNumber; }
    public void setMeterNumber(String meterNumber) { this.meterNumber = meterNumber; }
}