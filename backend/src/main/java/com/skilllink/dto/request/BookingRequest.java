package com.skilllink.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BookingRequest {

    @NotNull(message = "Provider ID is required")
    private Long providerId;

    @NotBlank(message = "Preferred date is required")
    private String preferredDate; // YYYY-MM-DD

    @NotBlank(message = "Preferred time is required")
    private String preferredTime; // HH:MM

    @NotBlank(message = "Job description is required")
    @Size(min = 20, max = 1000, message = "Job description must be between 20 and 1000 characters")
    private String jobDescription;
}
