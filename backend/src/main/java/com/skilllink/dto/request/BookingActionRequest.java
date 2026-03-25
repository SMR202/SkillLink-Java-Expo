package com.skilllink.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BookingActionRequest {

    @NotBlank(message = "Action is required")
    @Pattern(regexp = "^(accept|decline)$", message = "Action must be 'accept' or 'decline'")
    private String action;

    @Size(max = 500, message = "Decline reason must not exceed 500 characters")
    private String declineReason;
}
