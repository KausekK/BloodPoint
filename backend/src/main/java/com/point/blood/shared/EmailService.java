package com.point.blood.shared;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from:piotr.szczesny@nobexis.cc}")
    private String from;

    public void sendTempPasswordEmail(
            String to,
            String firstName,
            String tempPassword,
            String subject,
            String accountLabel
    ) {
        String text = """
                Witaj %s,

                Zostało utworzone dla Ciebie konto %s w systemie Blood Point.

                Login (e-mail): %s
                Tymczasowe hasło: %s

                Przy pierwszym logowaniu system poprosi Cię o zmianę hasła na własne.

                Pozdrawiamy,
                Zespół Blood Point
                """.formatted(firstName, accountLabel, to, tempPassword);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }
}
