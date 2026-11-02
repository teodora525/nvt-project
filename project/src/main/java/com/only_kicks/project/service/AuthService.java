package com.only_kicks.project.service;

import com.only_kicks.project.dto.AuthResponseDto;
import com.only_kicks.project.dto.LoginRequestDto;
import com.only_kicks.project.dto.RegisterRequestDto;
import com.only_kicks.project.model.CreditCard;
import com.only_kicks.project.model.Role;
import com.only_kicks.project.model.User;
import com.only_kicks.project.repository.UserRepository;
import com.only_kicks.project.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Transactional
    public void register(RegisterRequestDto request) {
        Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());

        User user;
        if (existingUserOpt.isPresent()) {
            User existing = existingUserOpt.get();
            if (existing.isActive()) {
                throw new IllegalArgumentException("Korisnik sa ovom email adresom već postoji i aktivan je.");
            }
            // If user previously registered but never activated (prevent permanent lockout)
            user = existing;
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setProfilePictureUrl(request.getProfilePictureUrl());
            if (user.getCreditCard() != null) {
                user.getCreditCard().setCardNumber(request.getCardNumber());
                user.getCreditCard().setCardHolder(request.getCardHolder());
                user.getCreditCard().setExpirationDate(request.getExpirationDate());
                user.getCreditCard().setCvv(request.getCvv());
            } else {
                CreditCard card = CreditCard.builder()
                        .cardNumber(request.getCardNumber())
                        .cardHolder(request.getCardHolder())
                        .expirationDate(request.getExpirationDate())
                        .cvv(request.getCvv())
                        .build();
                user.setCreditCard(card);
            }
        } else {
            CreditCard card = CreditCard.builder()
                    .cardNumber(request.getCardNumber())
                    .cardHolder(request.getCardHolder())
                    .expirationDate(request.getExpirationDate())
                    .cvv(request.getCvv())
                    .build();

            user = User.builder()
                    .email(request.getEmail().toLowerCase().trim())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .profilePictureUrl(request.getProfilePictureUrl())
                    .role(Role.ROLE_USER)
                    .active(false)
                    .creditCard(card)
                    .build();
        }

        String activationToken = UUID.randomUUID().toString();
        user.setActivationToken(activationToken);
        user.setActivationTokenExpiry(LocalDateTime.now().plusHours(24));

        userRepository.save(user);

        // Send activation email asynchronously
        emailService.sendActivationEmail(user.getEmail(), activationToken);
        log.info("Korisnik registrovan: {}, poslat aktivacioni mejl", user.getEmail());
    }

    @Transactional
    public String activateAccount(String token) {
        User user = userRepository.findByActivationToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Aktivacioni token je nevažeći."));

        if (user.getActivationTokenExpiry() != null && user.getActivationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Aktivacioni token je istekao. Molimo registrujte se ponovo.");
        }

        user.setActive(true);
        user.setActivationToken(null);
        user.setActivationTokenExpiry(null);
        userRepository.save(user);

        log.info("Nalog uspešno aktiviran za: {}", user.getEmail());
        return "Nalog je uspešno aktiviran! Sada se možete prijaviti na platformu.";
    }

    public AuthResponseDto login(LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Pogrešan email ili lozinka."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Pogrešan email ili lozinka.");
        }

        if (!user.isActive()) {
            throw new IllegalStateException("Nalog nije aktiviran. Molimo proverite vaš email za aktivacioni link.");
        }

        String token = jwtService.generateToken(user);

        return AuthResponseDto.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .profilePictureUrl(user.getProfilePictureUrl())
                .build();
    }
}
