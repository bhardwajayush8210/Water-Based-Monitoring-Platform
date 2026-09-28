package com.water.waterbilling.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(
        name = "water_usage",
        uniqueConstraints = @UniqueConstraint(columnNames = {"username", "usage_date"})
)
public class WaterUsageEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The resident who submitted this entry (matches User.username)
    private String username;

    @Column(name = "usage_date")
    private LocalDate date;

    @Column(name = "litres_used")
    private Double litresUsed;

    public WaterUsageEntry() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getLitresUsed() {
        return litresUsed;
    }

    public void setLitresUsed(Double litresUsed) {
        this.litresUsed = litresUsed;
    }
}