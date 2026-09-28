package com.water.waterbilling.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "persisted_alerts")
public class PersistedAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "apartment_id", nullable = false)
    private Apartment apartment;

    @Column(name = "resident_username", nullable = false)
    private String residentUsername;

    // "THRESHOLD" or "OUTLIER"
    @Column(name = "alert_type", nullable = false)
    private String alertType;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "litres_used", nullable = false)
    private double litresUsed;

    // The threshold litres (for THRESHOLD) or mean+2sd value (for OUTLIER)
    // that was crossed, kept for context in the message.
    @Column(name = "reference_value", nullable = false)
    private double referenceValue;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private boolean isRead = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public PersistedAlert() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Apartment getApartment() {
        return apartment;
    }

    public void setApartment(Apartment apartment) {
        this.apartment = apartment;
    }

    public String getResidentUsername() {
        return residentUsername;
    }

    public void setResidentUsername(String residentUsername) {
        this.residentUsername = residentUsername;
    }

    public String getAlertType() {
        return alertType;
    }

    public void setAlertType(String alertType) {
        this.alertType = alertType;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getLitresUsed() {
        return litresUsed;
    }

    public void setLitresUsed(double litresUsed) {
        this.litresUsed = litresUsed;
    }

    public double getReferenceValue() {
        return referenceValue;
    }

    public void setReferenceValue(double referenceValue) {
        this.referenceValue = referenceValue;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}