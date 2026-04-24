package com.skilllink.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProposalAcceptRequest {
    @NotBlank(message = "Preferred date is required")
    private String preferredDate;

    @NotBlank(message = "Preferred time is required")
    private String preferredTime;
}
