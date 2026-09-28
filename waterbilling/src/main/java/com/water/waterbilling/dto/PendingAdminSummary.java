package com.water.waterbilling.dto;

public class PendingAdminSummary {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String apartmentName;
    private String city;

    public PendingAdminSummary() {
    }

    public PendingAdminSummary(Long id, String fullName, String email, String phone, String apartmentName, String city) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.apartmentName = apartmentName;
        this.city = city;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getApartmentName() {
        return apartmentName;
    }

    public void setApartmentName(String apartmentName) {
        this.apartmentName = apartmentName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}