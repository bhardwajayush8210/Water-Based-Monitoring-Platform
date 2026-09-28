package com.water.waterbilling.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class NotificationService {

    private final JavaMailSender mailSender;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // 1. Monthly Bill Notification
    public void sendMonthlyBillEmail(String toEmail, String residentName, String period, double amount, String dueDate) {
        String subject = "New Water Bill Generated for " + period;
        String content = "<h3>Hello " + residentName + ",</h3>" +
                "<p>Your water invoice for <b>" + period + "</b> has been generated.</p>" +
                "<p><b>Total Amount Due:</b> INR " + String.format("%.2f", amount) + "</p>" +
                "<p><b>Due Date:</b> " + dueDate + "</p>" +
                "<p>Log into your Resident Dashboard to download the detailed PDF invoice or make payments.</p>";

        sendEmail(toEmail, subject, content);
    }

    // 2. Overuse Alert
    public void sendOveruseAlert(String toEmail, String residentName, double currentLitres, double threshold) {
        String subject = "WATER ALERT: High Consumption Detected";
        String content = "<h3 style='color: #C53030;'>High Usage Warning</h3>" +
                "<p>Dear " + residentName + ", your consumption has reached <b>" + currentLitres + " Litres</b>, " +
                "exceeding your monthly baseline threshold of " + threshold + " Litres.</p>" +
                "<h4>Tips to reduce consumption immediately:</h4>" +
                "<ul>" +
                "  <li>Check toilet flush valves and sink taps for silent leaks.</li>" +
                "  <li>Turn off taps while washing dishes or shaving.</li>" +
                "  <li>Shorten shower times by 2-3 minutes.</li>" +
                "</ul>";

        sendEmail(toEmail, subject, content);
    }

    // 3. Anomaly Detection Report to Admin
    public void sendAnomalyReportToAdmin(String adminEmail, String flatNumber, double spikeLitres) {
        String subject = "SYSTEM ANOMALY: Sudden Water Usage Spike in " + flatNumber;
        String content = "<h3>Community Admin Alert</h3>" +
                "<p>An unusual consumption anomaly was detected for <b>" + flatNumber + "</b>.</p>" +
                "<p><b>Logged Usage:</b> " + spikeLitres + " Litres within 24 hours.</p>" +
                "<p>Please verify meter integrity or notify the household of a potential major pipe leak.</p>";

        sendEmail(adminEmail, subject, content);
    }

    private void sendEmail(String to, String subject, String bodyHtml) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(bodyHtml, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send transactional email: " + e.getMessage());
        }
    }
}