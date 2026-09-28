package com.water.waterbilling.controller;

import com.water.waterbilling.entity.Ticket;
import com.water.waterbilling.entity.User;
import com.water.waterbilling.repository.TicketRepository;
import com.water.waterbilling.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketController(TicketRepository ticketRepository, UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public static class StatusTicketRequest {
        private Ticket.TicketStatus status;
        private String adminResponse;

        public StatusTicketRequest() {}
        public Ticket.TicketStatus getStatus() { return status; }
        public void setStatus(Ticket.TicketStatus status) { this.status = status; }
        public String getAdminResponse() { return adminResponse; }
        public void setAdminResponse(String adminResponse) { this.adminResponse = adminResponse; }
    }

    public static class ForwardTicketRequest {
        private String escalationNote;

        public ForwardTicketRequest() {}
        public String getEscalationNote() { return escalationNote; }
        public void setEscalationNote(String escalationNote) { this.escalationNote = escalationNote; }
    }

    // 1. Create Ticket
    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody Ticket ticket, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found: " + authentication.getName()));

        ticket.setUsername(user.getUsername());
        ticket.setApartment(user.getApartment());
        ticket.setFlatNumber(user.getFlatNumber());

        if ("SYSTEM_BUG".equalsIgnoreCase(ticket.getCategory()) || "ACCOUNT_ISSUE".equalsIgnoreCase(ticket.getCategory())) {
            ticket.setTargetRole(Ticket.TargetRole.SUPER_ADMIN);
        } else {
            ticket.setTargetRole(Ticket.TargetRole.COMMUNITY_ADMIN);
        }

        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    // 2. Get My Tickets (Resident)
    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(ticketRepository.findByUsernameOrderByCreatedAtDesc(authentication.getName()));
    }

    // 3. Get Community Admin Tickets
    @GetMapping("/community")
    public ResponseEntity<List<Ticket>> getCommunityTickets(Authentication authentication) {
        User admin = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        return ResponseEntity.ok(
                ticketRepository.findByApartmentAndTargetRoleOrderByCreatedAtDesc(
                        admin.getApartment(), Ticket.TargetRole.COMMUNITY_ADMIN
                )
        );
    }

    // 4. Get Super Admin Tickets
    @GetMapping("/superadmin")
    public ResponseEntity<List<Ticket>> getSuperAdminTickets() {
        return ResponseEntity.ok(ticketRepository.findByTargetRoleOrderByCreatedAtDesc(Ticket.TargetRole.SUPER_ADMIN));
    }

    // 5. Update Status & Admin Response
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StatusTicketRequest req) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (req.getStatus() != null) {
            ticket.setStatus(req.getStatus());
        }
        if (req.getAdminResponse() != null && !req.getAdminResponse().isBlank()) {
            ticket.setAdminResponse(req.getAdminResponse());
        }

        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    // 6. Forward Ticket to Super Admin
    @PutMapping("/{id}/escalate")
    public ResponseEntity<?> forwardToSuperAdmin(@PathVariable Long id, @RequestBody ForwardTicketRequest req) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setTargetRole(Ticket.TargetRole.SUPER_ADMIN);
        ticket.setStatus(Ticket.TicketStatus.ESCALATED);

        if (req != null && req.getEscalationNote() != null && !req.getEscalationNote().isBlank()) {
            ticket.setEscalationNote(req.getEscalationNote());
        }

        return ResponseEntity.ok(ticketRepository.save(ticket));
    }
}