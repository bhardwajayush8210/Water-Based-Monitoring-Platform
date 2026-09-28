package com.water.waterbilling.dto;

public class CommunityAdminRegisterRequest {

    private String fullName;
    private String email;
    private String phone;
    private String username;
    private String password;

    private String apartment;
    private String apartmentAddress;
    private String city;
    private String state;
    private String pincode;
    private Integer totalHouseholds;

    public CommunityAdminRegisterRequest() {
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password){
        this.password=password;
    }

    public String getPassword(){
        return password;
    }

    public String getApartment() {
        return apartment;
    }

    public void setApartment(String apartment) {
        this.apartment = apartment;
    }

    public String getApartmentAddress() {
        return apartmentAddress;
    }

    public void setApartmentAddress(String apartmentAddress) {
        this.apartmentAddress = apartmentAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city){
        this.city=city;
    }

    public String getState(){
        return state;
    }

    public void setState(String state){
        this.state=state;
    }

    public String getPincode(){
        return pincode;
    }

    public void setPincode(String pincode){
        this.pincode=pincode;
    }

    public Integer getTotalHouseholds(){
        return totalHouseholds;
    }

    public void setTotalHouseholds(Integer totalHouseholds){
        this.totalHouseholds=totalHouseholds;
    }

}