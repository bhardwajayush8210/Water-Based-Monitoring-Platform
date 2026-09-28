package com.water.waterbilling.repository;

import com.water.waterbilling.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // 1. Used by TicketController (Resident)
    List<Ticket> findByUsernameOrderByCreatedAtDesc(String username);

    // 2. Used by TicketController (Community Admin)
    List<Ticket> findByApartmentAndTargetRoleOrderByCreatedAtDesc(String apartment, Ticket.TargetRole targetRole);

    // 3. Used by TicketController (Super Admin)
    List<Ticket> findByTargetRoleOrderByCreatedAtDesc(Ticket.TargetRole targetRole);

    // 4. String variant for target role queries
    List<Ticket> findByTargetRoleOrderByIdDesc(String targetRole);

    List<Ticket> findByTargetRoleOrderByPriorityDescCreatedAtDesc(Ticket.TargetRole targetRole);
}