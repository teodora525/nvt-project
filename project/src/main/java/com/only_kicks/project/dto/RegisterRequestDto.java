package com.only_kicks.project.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDto {

    @NotBlank(message = "Ime je obavezno")
    private String firstName;

    @NotBlank(message = "Prezime je obavezno")
    private String lastName;

    @NotBlank(message = "Email je obavezan")
    @Email(message = "Email format nije validan")
    private String email;

    @NotBlank(message = "Lozinka je obavezna")
    @Size(min = 6, message = "Lozinka mora imati najmanje 6 karaktera")
    private String password;

    @NotBlank(message = "Profilna slika je obavezna")
    private String profilePictureUrl;

    @NotBlank(message = "Broj kartice je obavezan")
    @Pattern(regexp = "^[0-9]{13,19}$", message = "Broj kartice mora imati između 13 i 19 cifara")
    private String cardNumber;

    @NotBlank(message = "Ime na kartici je obavezno")
    private String cardHolder;

    @NotBlank(message = "Datum isteka je obavezan (MM/YY)")
    @Pattern(regexp = "^(0[1-9]|1[0-2])/[0-9]{2}$", message = "Format datuma isteka mora biti MM/YY")
    private String expirationDate;

    @NotBlank(message = "CVV je obavezan")
    @Pattern(regexp = "^[0-9]{3,4}$", message = "CVV mora imati 3 ili 4 cifre")
    private String cvv;
}
