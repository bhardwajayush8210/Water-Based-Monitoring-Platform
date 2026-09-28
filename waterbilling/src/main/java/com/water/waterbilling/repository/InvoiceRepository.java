package com.water.waterbilling.repository;

import com.water.waterbilling.entity.BillingCycle;
import com.water.waterbilling.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    List<Invoice> findByBillingCycleOrderByResidentFullNameAsc(BillingCycle billingCycle);

    List<Invoice> findByResidentUsernameOrderByIdDesc(String residentUsername);

}