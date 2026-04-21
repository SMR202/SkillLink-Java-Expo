package com.skilllink.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EarningsResponse {
    private BigDecimal totalEarnings;
    private BigDecimal pendingPayouts;
    private BigDecimal thisMonthEarnings;
    private Long completedPayments;
    private Long totalBookingsCompleted;
}
