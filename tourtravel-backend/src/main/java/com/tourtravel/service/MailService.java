package com.tourtravel.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    /**
     * Synchronous (not @Async) — callers that need to know whether the send
     * actually succeeded (e.g. QuotationService, which reports failure back
     * to the admin rather than silently swallowing it) call this directly.
     */
    public void sendEmailWithAttachment(String to, String subject, String body,
                                         byte[] attachmentBytes, String attachmentFilename) throws Exception {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body);
        helper.addAttachment(attachmentFilename, new org.springframework.core.io.ByteArrayResource(attachmentBytes));
        mailSender.send(mimeMessage);
        log.info("Email with attachment '{}' sent successfully to {}", attachmentFilename, to);
    }

    public void sendOtpEmail(String email, String otp) {
        String subject = "Your Sainath Holidays OTP";
        String body = "Dear Traveler,\n\nYour One-Time Password (OTP) for login is: " + otp +
                      "\n\nThis OTP is valid for 5 minutes. Do not share it with anyone.\n\nHappy Journey,\nSainath Holidays";
        sendEmail(email, subject, body);
    }
}
