package com.water.waterbilling.service;

import com.water.waterbilling.dto.*;
import com.water.waterbilling.entity.*;
import com.water.waterbilling.repository.*;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class BillingCycleService {


    private final BillingCycleRepository billingCycleRepository;
    private final InvoiceRepository invoiceRepository;
    private final ApartmentRepository apartmentRepository;
    private final UserRepository userRepository;
    private final WaterUsageRepository waterUsageRepository;
    private final TariffPlanRepository tariffPlanRepository;
    private final WaterPurchaseRepository waterPurchaseRepository;



    public BillingCycleService(
            BillingCycleRepository billingCycleRepository,
            InvoiceRepository invoiceRepository,
            ApartmentRepository apartmentRepository,
            UserRepository userRepository,
            WaterUsageRepository waterUsageRepository,
            TariffPlanRepository tariffPlanRepository,
            WaterPurchaseRepository waterPurchaseRepository
    ) {

        this.billingCycleRepository = billingCycleRepository;
        this.invoiceRepository = invoiceRepository;
        this.apartmentRepository = apartmentRepository;
        this.userRepository = userRepository;
        this.waterUsageRepository = waterUsageRepository;
        this.tariffPlanRepository = tariffPlanRepository;
        this.waterPurchaseRepository = waterPurchaseRepository;

    }





    private Apartment getApartmentForAdmin(
            String adminUsername
    ){

        User admin =
                userRepository.findByUsername(adminUsername)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Admin not found"
                                )
                        );


        return apartmentRepository
                .findByCommunityAdmin(admin)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Apartment not found"
                        )
                );

    }






    // ================= OPEN BILLING CYCLE =================


    public BillingCycleResponse openCycle(
            String adminUsername,
            OpenCycleRequest request
    ){

        Apartment apartment =
                getApartmentForAdmin(adminUsername);



        boolean exists =
                billingCycleRepository
                        .existsByApartmentAndStatus(
                                apartment,
                                "OPEN"
                        );


        if(exists){

            throw new RuntimeException(
                    "OPEN billing cycle already exists"
            );

        }




        if(request.getEndDate()
                .isBefore(
                        request.getStartDate()
                )){

            throw new RuntimeException(
                    "End date cannot be before start date"
            );

        }





        BillingCycle cycle =
                new BillingCycle();


        cycle.setApartment(
                apartment
        );


        cycle.setPeriodLabel(
                request.getPeriodLabel()
        );


        cycle.setStartDate(
                request.getStartDate()
        );


        cycle.setEndDate(
                request.getEndDate()
        );


        cycle.setStatus(
                "OPEN"
        );



        return toResponse(
                billingCycleRepository.save(cycle)
        );

    }







    // ================= FINALIZE CYCLE =================


    public BillingCycleResponse finalizeCycle(
            String adminUsername,
            Long cycleId
    ){

        Apartment apartment =
                getApartmentForAdmin(adminUsername);



        BillingCycle cycle =
                getOwnedCycle(
                        apartment,
                        cycleId
                );



        if(
                !"OPEN".equals(
                        cycle.getStatus()
                )
        ){

            throw new RuntimeException(
                    "Only OPEN cycle can be finalized"
            );

        }





        String apartmentName =
                apartment.getApartmentName();




        List<User> residents =
                userRepository.findAll()
                        .stream()
                        .filter(u ->
                                "RESIDENT"
                                        .equals(u.getRole())
                        )
                        .filter(u ->
                                apartmentName.equalsIgnoreCase(
                                        u.getApartment()
                                )
                        )
                        .toList();






        // CURRENT TARIFF

        TariffPlan tariff =
                tariffPlanRepository
                        .findByApartment(apartment)
                        .orElse(null);






        // Calculate resident usage inside cycle dates

        Map<String,Double> usageMap =
                residents.stream()
                        .collect(
                                Collectors.toMap(
                                        User::getUsername,

                                        resident ->

                                                waterUsageRepository
                                                        .findByUsernameOrderByDateAsc(
                                                                resident.getUsername()
                                                        )
                                                        .stream()
                                                        .filter(entry ->

                                                                !entry.getDate()
                                                                        .isBefore(
                                                                                cycle.getStartDate()
                                                                        )
                                                                        &&

                                                                        !entry.getDate()
                                                                                .isAfter(
                                                                                        cycle.getEndDate()
                                                                                )

                                                        )
                                                        .mapToDouble(
                                                                WaterUsageEntry::getLitresUsed
                                                        )
                                                        .sum()
                                )
                        );






        double totalCommunityUsage =
                usageMap.values()
                        .stream()
                        .mapToDouble(
                                Double::doubleValue
                        )
                        .sum();


        double purchaseCost =
                waterPurchaseRepository
                        .findByApartmentOrderByPurchaseDateDesc(
                                apartment
                        )
                        .stream()
                        .filter(p ->

                                !p.getPurchaseDate()
                                        .isBefore(
                                                cycle.getStartDate()
                                        )

                                        &&

                                        !p.getPurchaseDate()
                                                .isAfter(
                                                        cycle.getEndDate()
                                                )

                        )
                        .mapToDouble(
                                WaterPurchase::getTotalCostInr
                        )
                        .sum();






        for(User resident : residents){


            double litres =
                    usageMap.getOrDefault(
                            resident.getUsername(),
                            0.0
                    );



            double baseCharge =
                    calculateBill(
                            litres,
                            tariff
                    );



            double sharedAllocation = 0;




            if(
                    purchaseCost > 0
                            &&
                            totalCommunityUsage > 0
            ){

                sharedAllocation =
                        purchaseCost *
                                (
                                        litres /
                                                totalCommunityUsage
                                );


            }
            else if(
                    purchaseCost > 0
            ){

                sharedAllocation =
                        purchaseCost /
                                residents.size();

            }





            Invoice invoice =
                    new Invoice();



            invoice.setBillingCycle(
                    cycle
            );


            invoice.setResidentUsername(
                    resident.getUsername()
            );


            invoice.setResidentFullName(
                    resident.getFullName()
            );


            invoice.setFlatNumber(
                    resident.getFlatNumber()
            );


            invoice.setMeterNumber(
                    resident.getMeterNumber()
            );


            invoice.setLitresUsed(
                    litres
            );


            invoice.setBaseChargeInr(
                    round2(baseCharge)
            );


            invoice.setSharedAreaAllocationInr(
                    round2(sharedAllocation)
            );


            invoice.setAdjustmentInr(
                    0
            );


            invoice.setTotalInr(
                    round2(
                            baseCharge +
                                    sharedAllocation
                    )
            );



            invoiceRepository.save(invoice);

        }





        cycle.setStatus(
                "FINALIZED"
        );


        cycle.setFinalizedAt(
                LocalDateTime.now()
        );



        billingCycleRepository.save(cycle);



        return toResponse(cycle);

    }







    private double calculateBill(
            double litres,
            TariffPlan tariff
    ){

        if(tariff == null)
            return 0;


        double threshold =
                tariff.getTier1ThresholdLitres();



        double tier1 =
                Math.min(
                        litres,
                        threshold
                );


        double tier2 =
                Math.max(
                        0,
                        litres - threshold
                );



        return
                (
                        tier1 *
                                tariff.getTier1RateInr()
                )
                        +
                        (
                                tier2 *
                                        tariff.getTier2RateInr()
                        );

    }




    private double round2(
            double value
    ){

        return Math.round(
                value * 100
        ) / 100.0;

    }


    // ================= ARCHIVE CYCLE =================


    public BillingCycleResponse archiveCycle(
            String adminUsername,
            Long cycleId
    ){

        Apartment apartment =
                getApartmentForAdmin(adminUsername);



        BillingCycle cycle =
                getOwnedCycle(
                        apartment,
                        cycleId
                );



        if(
                !"FINALIZED".equals(
                        cycle.getStatus()
                )
        ){

            throw new RuntimeException(
                    "Only FINALIZED cycle can be archived"
            );

        }




        cycle.setStatus(
                "ARCHIVED"
        );


        cycle.setArchivedAt(
                LocalDateTime.now()
        );



        billingCycleRepository.save(cycle);



        return toResponse(cycle);

    }


    public InvoiceResponse applyAdjustment(
            String adminUsername,
            Long invoiceId,
            AdjustmentRequest request
    ){


        Apartment apartment =
                getApartmentForAdmin(adminUsername);




        Invoice invoice =
                invoiceRepository
                        .findById(invoiceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invoice not found"
                                )
                        );






        if(
                !invoice.getBillingCycle()
                        .getApartment()
                        .getId()
                        .equals(
                                apartment.getId()
                        )
        ){

            throw new RuntimeException(
                    "Invoice does not belong to your apartment"
            );

        }


        if(
                !"FINALIZED"
                        .equals(
                                invoice.getBillingCycle()
                                        .getStatus()
                        )
        ){

            throw new RuntimeException(
                    "Adjustment allowed only after finalize"
            );

        }


        invoice.setAdjustmentInr(
                round2(
                        request.getAdjustmentInr()
                )
        );



        invoice.setAdjustmentReason(
                request.getReason()
        );



        invoice.setTotalInr(
                round2(

                        invoice.getBaseChargeInr()

                                +

                                invoice.getSharedAreaAllocationInr()

                                +

                                request.getAdjustmentInr()

                )
        );


        return toInvoiceResponse(
                invoiceRepository.save(invoice)
        );


    }


    // ================= GET ADMIN BILLING CYCLES =================


    public List<BillingCycleResponse> getCyclesForAdmin(
            String adminUsername
    ){

        Apartment apartment =
                getApartmentForAdmin(adminUsername);



        return billingCycleRepository
                .findByApartmentOrderByStartDateDesc(
                        apartment
                )
                .stream()
                .map(this::toResponse)
                .toList();

    }


    // ================= GET INVOICES FOR CYCLE =================


    public List<InvoiceResponse> getInvoicesForCycle(
            String adminUsername,
            Long cycleId
    ){

        Apartment apartment =
                getApartmentForAdmin(adminUsername);




        BillingCycle cycle =
                getOwnedCycle(
                        apartment,
                        cycleId
                );




        return invoiceRepository
                .findByBillingCycleOrderByResidentFullNameAsc(
                        cycle
                )
                .stream()
                .map(this::toInvoiceResponse)
                .toList();


    }

    // ================= RESIDENT INVOICES =================


    public List<InvoiceResponse> getInvoicesForResident(
            String username
    ){


        return invoiceRepository
                .findByResidentUsernameOrderByIdDesc(
                        username
                )
                .stream()
                .map(this::toInvoiceResponse)
                .toList();

    }

    // ================= OWNERSHIP CHECK =================


    private BillingCycle getOwnedCycle(
            Apartment apartment,
            Long cycleId
    ){


        BillingCycle cycle =
                billingCycleRepository
                        .findById(cycleId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Billing cycle not found"
                                )
                        );





        if(
                !cycle.getApartment()
                        .getId()
                        .equals(
                                apartment.getId()
                        )
        ){

            throw new RuntimeException(
                    "Unauthorized billing cycle"
            );

        }



        return cycle;

    }

    // ================= RESPONSE CONVERTERS =================



    private BillingCycleResponse toResponse(
            BillingCycle cycle
    ){


        List<Invoice> invoices =
                invoiceRepository
                        .findByBillingCycleOrderByResidentFullNameAsc(
                                cycle
                        );



        Double total =
                "OPEN".equals(
                        cycle.getStatus()
                )
                        ?
                        null
                        :
                        round2(
                                invoices.stream()
                                .mapToDouble(
                                        Invoice::getTotalInr
                                )
                                .sum()
                        );




        return new BillingCycleResponse(

                cycle.getId(),

                cycle.getPeriodLabel(),

                cycle.getStartDate()
                        .toString(),

                cycle.getEndDate()
                        .toString(),

                cycle.getStatus(),

                invoices.size(),

                total,

                cycle.getFinalizedAt()!=null
                        ?
                        cycle.getFinalizedAt()
                        .toString()
                        :
                        null,

                cycle.getArchivedAt()!=null
                        ?
                        cycle.getArchivedAt()
                        .toString()
                        :
                        null

        );


    }


    private InvoiceResponse toInvoiceResponse(
            Invoice invoice
    ){


        return new InvoiceResponse(


                invoice.getId(),


                invoice.getBillingCycle()
                        .getPeriodLabel(),


                invoice.getBillingCycle()
                        .getStatus(),


                invoice.getResidentUsername(),


                invoice.getResidentFullName(),


                invoice.getFlatNumber(),


                invoice.getMeterNumber(),


                invoice.getLitresUsed(),


                invoice.getBaseChargeInr(),


                invoice.getSharedAreaAllocationInr(),


                invoice.getAdjustmentInr(),


                invoice.getAdjustmentReason(),


                invoice.getTotalInr()

        );

    }

}