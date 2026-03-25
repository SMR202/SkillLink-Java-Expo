package com.skilllink.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SignupRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[!@#$%^&*]).*$",
        message = "Password must contain at least 1 number and 1 special character"
    )
    private String password;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(CLIENT|PROVIDER)$", message = "Role must be CLIENT or PROVIDER")
    private String role;
}
