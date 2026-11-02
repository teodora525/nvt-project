package com.only_kicks.project.config;

import com.only_kicks.project.model.CreditCard;
import com.only_kicks.project.model.Role;
import com.only_kicks.project.model.User;
import com.only_kicks.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createAdminIfNotExists("admin@onlykicks.com", "Admin", "Glavni");
        createAdminIfNotExists("admin2@onlykicks.com", "Admin", "Pomocni");
    }

    private void createAdminIfNotExists(String email, String firstName, String lastName) {
        if (!userRepository.existsByEmail(email)) {
            CreditCard card = CreditCard.builder()
                    .cardNumber("4111111111111111")
                    .cardHolder(firstName + " " + lastName)
                    .expirationDate("12/28")
                    .cvv("123")
                    .build();

            User admin = User.builder()
                    .email(email)
                    .password(passwordEncoder.encode("admin123"))
                    .firstName(firstName)
                    .lastName(lastName)
                    .profilePictureUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")
                    .role(Role.ROLE_ADMIN)
                    .active(true)
                    .creditCard(card)
                    .build();

            userRepository.save(admin);
            log.info("Kreiran podrazumevani admin nalog: {}", email);
        }
    }
}
