package com.skilllink.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PaymentCheckoutRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // CARD, WALLET

    @NotBlank(message = "Payment token is required")
    private String paymentToken;

    private Double amount; // optional override, otherwise use booking service rate
}
