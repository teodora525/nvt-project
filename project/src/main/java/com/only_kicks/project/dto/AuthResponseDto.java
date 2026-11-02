package com.only_kicks.project.dto;

import com.only_kicks.project.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {
    private String token;
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private String profilePictureUrl;
}
