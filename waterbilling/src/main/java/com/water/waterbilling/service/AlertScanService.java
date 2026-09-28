package com.water.waterbilling.service;

import com.water.waterbilling.dto.PersistedAlertResponse;
import com.water.waterbilling.entity.Apartment;
import com.water.waterbilling.entity.PersistedAlert;
import com.water.waterbilling.entity.TariffPlan;
import com.water.waterbilling.entity.User;
import com.water.waterbilling.entity.WaterUsageEntry;
import com.water.waterbilling.repository.ApartmentRepository;
import com.water.waterbilling.repository.PersistedAlertRepository;
import com.water.waterbilling.repository.TariffPlanRepository;
import com.water.waterbilling.repository.UserRepository;
import com.water.waterbilling.repository.WaterUsageRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class AlertScanService {


    private static final double DEFAULT_THRESHOLD = 300.0;

    private static final int HISTORY_DAYS = 30;

    private static final int MIN_HISTORY_FOR_OUTLIER = 3;

    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("d MMM");



    private final ApartmentRepository apartmentRepository;
    private final UserRepository userRepository;
    private final WaterUsageRepository waterUsageRepository;
    private final TariffPlanRepository tariffPlanRepository;
    private final PersistedAlertRepository persistedAlertRepository;



    public AlertScanService(
            ApartmentRepository apartmentRepository,
            UserRepository userRepository,
            WaterUsageRepository waterUsageRepository,
            TariffPlanRepository tariffPlanRepository,
            PersistedAlertRepository persistedAlertRepository
    ) {

        this.apartmentRepository = apartmentRepository;
        this.userRepository = userRepository;
        this.waterUsageRepository = waterUsageRepository;
        this.tariffPlanRepository = tariffPlanRepository;
        this.persistedAlertRepository = persistedAlertRepository;

    }




    // Runs every hour
    @Scheduled(cron = "0 0 * * * *")
    public void runScheduledScan() {

        for (Apartment apartment : apartmentRepository.findAll()) {

            scanApartment(apartment);

        }

    }




    public void scanApartmentByAdmin(String adminUsername) {


        User admin =
                userRepository.findByUsername(adminUsername)
                        .orElseThrow(() ->
                                new RuntimeException("Admin not found")
                        );


        Apartment apartment =
                apartmentRepository
                        .findByCommunityAdmin(admin)
                        .orElseThrow(() ->
                                new RuntimeException("Apartment not found")
                        );


        scanApartment(apartment);

    }





    private void scanApartment(Apartment apartment) {


        /*
         * TariffPlan is linked using apartment_id
         */
        double threshold =
                tariffPlanRepository
                        .findByApartment(apartment)
                        .map(TariffPlan::getDailyAlertThresholdLitres)
                        .orElse(DEFAULT_THRESHOLD);



        String apartmentName =
                apartment.getApartmentName();




        List<User> residents =
                userRepository.findAll()
                        .stream()
                        .filter(u ->
                                "RESIDENT".equals(u.getRole())
                        )
                        .filter(u ->
                                apartmentName.equalsIgnoreCase(
                                        u.getApartment()
                                )
                        )
                        .toList();




        LocalDate cutoff =
                LocalDate.now()
                        .minusDays(HISTORY_DAYS - 1);




        for(User resident : residents){


            List<WaterUsageEntry> history =
                    waterUsageRepository
                            .findByUsernameOrderByDateAsc(
                                    resident.getUsername()
                            )
                            .stream()
                            .filter(e ->
                                    !e.getDate()
                                            .isBefore(cutoff)
                            )
                            .toList();



            if(history.isEmpty())
                continue;



            WaterUsageEntry latest =
                    history.get(history.size() - 1);




            // Threshold Alert

            if(latest.getLitresUsed() > threshold){


                createAlertIfNew(
                        apartment,
                        resident,
                        "THRESHOLD",
                        latest.getDate(),
                        latest.getLitresUsed(),
                        threshold,
                        latest.getLitresUsed()
                                + " L used on "
                                + latest.getDate()
                                .format(DATE_FORMAT)
                                + " - exceeded "
                                + threshold
                                + " L daily limit."
                );

            }





            // Outlier Detection


            List<WaterUsageEntry> previous =
                    history.subList(
                            0,
                            history.size() - 1
                    );



            if(previous.size() >= MIN_HISTORY_FOR_OUTLIER){


                double mean =
                        previous.stream()
                                .mapToDouble(
                                        WaterUsageEntry::getLitresUsed
                                )
                                .average()
                                .orElse(0);



                double variance =
                        previous.stream()
                                .mapToDouble(
                                        e ->
                                                Math.pow(
                                                        e.getLitresUsed()
                                                                - mean,
                                                        2
                                                )
                                )
                                .average()
                                .orElse(0);



                double standardDeviation =
                        Math.sqrt(variance);



                double limit =
                        mean + (2 * standardDeviation);




                if(
                        standardDeviation > 0
                                &&
                                latest.getLitresUsed() > limit
                ){


                    createAlertIfNew(
                            apartment,
                            resident,
                            "OUTLIER",
                            latest.getDate(),
                            latest.getLitresUsed(),
                            limit,
                            latest.getLitresUsed()
                                    + " L usage detected on "
                                    + latest.getDate()
                                    .format(DATE_FORMAT)
                                    + ". Possible leak."
                    );

                }

            }

        }

    }





    private void createAlertIfNew(
            Apartment apartment,
            User resident,
            String type,
            LocalDate date,
            double litresUsed,
            double referenceValue,
            String message
    ){


        if(
                persistedAlertRepository
                        .existsByResidentUsernameAndDateAndAlertType(
                                resident.getUsername(),
                                date,
                                type
                        )
        ){
            return;
        }




        PersistedAlert alert =
                new PersistedAlert();


        alert.setApartment(apartment);

        alert.setResidentUsername(
                resident.getUsername()
        );

        alert.setAlertType(type);

        alert.setDate(date);

        alert.setLitresUsed(litresUsed);

        alert.setReferenceValue(referenceValue);

        alert.setMessage(message);



        persistedAlertRepository.save(alert);

    }





    public List<PersistedAlertResponse> getAlertsForAdmin(
            String adminUsername
    ){


        User admin =
                userRepository.findByUsername(adminUsername)
                        .orElseThrow(() ->
                                new RuntimeException("Admin not found")
                        );



        Apartment apartment =
                apartmentRepository
                        .findByCommunityAdmin(admin)
                        .orElseThrow(() ->
                                new RuntimeException("Apartment not found")
                        );



        Map<String,User> residents =
                userRepository.findAll()
                        .stream()
                        .filter(u ->
                                "RESIDENT".equals(u.getRole())
                        )
                        .collect(
                                Collectors.toMap(
                                        User::getUsername,
                                        u -> u,
                                        (a,b) -> a
                                )
                        );



        return persistedAlertRepository
                .findByApartmentOrderByCreatedAtDesc(apartment)
                .stream()
                .map(a ->
                        toResponse(
                                a,
                                residents.get(
                                        a.getResidentUsername()
                                )
                        )
                )
                .toList();

    }





    public List<PersistedAlertResponse> getAlertsForResident(
            String username
    ){


        User resident =
                userRepository.findByUsername(username)
                        .orElse(null);



        return persistedAlertRepository
                .findByResidentUsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(a ->
                        toResponse(
                                a,
                                resident
                        )
                )
                .toList();

    }





    public void markAsRead(
            String username,
            Long id
    ){


        PersistedAlert alert =
                persistedAlertRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Alert not found"
                                )
                        );



        if(!alert.getResidentUsername()
                .equals(username)){

            throw new RuntimeException(
                    "Unauthorized alert"
            );

        }



        alert.setRead(true);

        persistedAlertRepository.save(alert);

    }





    private PersistedAlertResponse toResponse(
            PersistedAlert alert,
            User resident
    ){


        return new PersistedAlertResponse(

                alert.getId(),

                alert.getResidentUsername(),

                resident != null
                        ?
                        resident.getFullName()
                        :
                        alert.getResidentUsername(),

                resident != null
                        ?
                        resident.getFlatNumber()
                        :
                        null,

                alert.getAlertType(),

                alert.getDate()
                        .format(DATE_FORMAT),

                alert.getLitresUsed(),

                alert.getReferenceValue(),

                alert.getMessage(),

                alert.isRead()

        );

    }

}