package com.skilllink.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProposalRequest {
    @NotBlank(message = "Cover message is required")
    @Size(min = 20, max = 2000, message = "Cover message must be between 20 and 2000 characters")
    private String coverMessage;

    @NotNull(message = "Proposed price is required")
    @DecimalMin(value = "1.00", message = "Proposed price must be greater than zero")
    private BigDecimal proposedPrice;

    @NotBlank(message = "Estimated delivery time is required")
    private String estimatedDeliveryTime;
}
