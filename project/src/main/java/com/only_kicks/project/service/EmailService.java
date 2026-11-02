package com.only_kicks.project.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendActivationEmail(String to, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("no-reply@onlykicks.com");
            helper.setTo(to);
            helper.setSubject("OnlyKicks - Aktivacija naloga");

            String activationUrl = "http://localhost:8080/api/auth/activate?token=" + token;

            String content = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                        <h2 style="color: #111827;">Dobrodošli na OnlyKicks!</h2>
                        <p style="color: #4b5563; font-size: 16px;">Hvala vam na registraciji. Da biste aktivirali svoj nalog i počeli sa korišćenjem platforme, kliknite na dugme ispod:</p>
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="%s" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Aktiviraj nalog</a>
                        </div>
                        <p style="color: #6b7280; font-size: 14px;">Ili kopirajte sledeći link u pretraživač:</p>
                        <p style="color: #2563eb; font-size: 12px; word-break: break-all;">%s</p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                        <p style="color: #9ca3af; font-size: 12px;">Link važi 24 sata. Ako niste zatražili ovu registraciju, slobodno ignorišite ovaj mejl.</p>
                    </div>
                    """.formatted(activationUrl, activationUrl);

            helper.setText(content, true);
            mailSender.send(message);
            log.info("Aktivacioni mejl uspešno poslat na: {}", to);
        } catch (Exception e) {
            log.error("Greška prilikom slanja aktivacionog mejla na {}: {}", to, e.getMessage(), e);
        }
    }
}
