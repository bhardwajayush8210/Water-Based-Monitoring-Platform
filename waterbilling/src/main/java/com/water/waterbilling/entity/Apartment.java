package com.water.waterbilling.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "apartments")
public class Apartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String apartmentName;

    @Column(nullable = false)
    private String address;

    private String city;

    private String state;

    private String pincode;

    @Column(nullable = false)
    private Integer totalFlats;

    @OneToOne
    @JoinColumn(name = "community_admin_id")
    private User communityAdmin;

    // Shareable token used to invite residents directly into this
    // apartment, bypassing the free-text/dropdown apartment selection.
    @Column(unique = true)
    private String inviteToken;

    public Apartment() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApartmentName() {
        return apartmentName;
    }

    public void setApartmentName(String apartmentName) {
        this.apartmentName = apartmentName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public Integer getTotalFlats() {
        return totalFlats;
    }

    public void setTotalFlats(Integer totalFlats) {
        this.totalFlats = totalFlats;
    }

    public User getCommunityAdmin() {
        return communityAdmin;
    }

    public void setCommunityAdmin(User communityAdmin) {
        this.communityAdmin = communityAdmin;
    }

    public String getInviteToken() {
        return inviteToken;
    }

    public void setInviteToken(String inviteToken) {
        this.inviteToken = inviteToken;
    }
}