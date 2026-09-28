package com.water.waterbilling.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String apartment;
    private String flatNumber;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private String category; // "METER_LEAK", "BILLING_DISCREPANCY", "SYSTEM_BUG"

    @Enumerated(EnumType.STRING)
    private TargetRole targetRole; // COMMUNITY_ADMIN or SUPER_ADMIN

    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.OPEN;// OPEN, IN_PROGRESS, RESOLVED, ESCALATED

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Column(columnDefinition = "TEXT")
    private String adminResponse;

    @Column(columnDefinition = "TEXT")
    private String escalationNote;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TargetRole {
        COMMUNITY_ADMIN, SUPER_ADMIN
    }

    public enum TicketStatus {
        OPEN, IN_PROGRESS, RESOLVED, ESCALATED
    }

    public enum Priority {
        HIGH, MEDIUM, LOW
    }


    public Ticket() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getApartment() { return apartment; }
    public void setApartment(String apartment) { this.apartment = apartment; }
    public String getFlatNumber() { return flatNumber; }
    public void setFlatNumber(String flatNumber) { this.flatNumber = flatNumber; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public TargetRole getTargetRole() { return targetRole; }
    public void setTargetRole(TargetRole targetRole) { this.targetRole = targetRole; }
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
    public String getAdminResponse() { return adminResponse; }
    public void setAdminResponse(String adminResponse) { this.adminResponse = adminResponse; }
    public String getEscalationNote() { return escalationNote; }
    public void setEscalationNote(String escalationNote) { this.escalationNote = escalationNote; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }


    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
}