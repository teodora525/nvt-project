package com.only_kicks.project.controller;

import com.only_kicks.project.dto.AuthResponseDto;
import com.only_kicks.project.dto.LoginRequestDto;
import com.only_kicks.project.dto.RegisterRequestDto;
import com.only_kicks.project.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDto request) {
        authService.register(request);
        return ResponseEntity.ok(Map.of(
                "message", "Uspešna registracija! Poslat je aktivacioni mejl na unetu adresu."
        ));
    }

    @GetMapping("/activate")
    public ResponseEntity<String> activate(@RequestParam("token") String token) {
        String result = authService.activateAccount(token);
        // HTML response for comfortable browser click from Mailpit
        String html = """
                <!DOCTYPE html>
                <html lang="sr">
                <head>
                    <meta charset="UTF-8">
                    <title>Aktivacija naloga</title>
                    <style>
                        body { font-family: Arial, sans-serif; background: #f3f4f6; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                        .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center; max-width: 450px; }
                        h1 { color: #10b981; font-size: 24px; margin-bottom: 12px; }
                        p { color: #4b5563; font-size: 16px; margin-bottom: 24px; }
                        a { background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>✓ Nalog uspešno aktiviran!</h1>
                        <p>%s</p>
                        <a href="http://localhost:4200/login">Idi na prijavu</a>
                    </div>
                </body>
                </html>
                """.formatted(result);
        return ResponseEntity.ok().header("Content-Type", "text/html; charset=UTF-8").body(html);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
