package com.water.waterbilling.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String sender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendInviteEmail(String toEmail,
                                String adminName,
                                String apartmentName,
                                String inviteLink) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(sender);

        message.setTo(toEmail);

        message.setSubject("Invitation to Join " + apartmentName);

        message.setText(
                "Hello,\n\n" +

                        adminName +

                        " has invited you to join "

                        + apartmentName +

                        ".\n\n"

                        + "Click the link below to register:\n\n"

                        + inviteLink +

                        "\n\n"

                        + "Regards,\n"

                        + "Water Billing Platform"
        );

        mailSender.send(message);
    }
}