package com.skilllink.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private String clientName;
    private String providerName;
    private BigDecimal amount;
    private BigDecimal platformFee;
    private BigDecimal providerEarnings;
    private String status;
    private String paymentMethod;
    private String transactionRef;
    private LocalDateTime paidAt;
}
