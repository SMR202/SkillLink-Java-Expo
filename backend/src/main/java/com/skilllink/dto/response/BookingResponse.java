package com.skilllink.dto.response;

import com.skilllink.entity.Booking;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingResponse {
    private Long id;
    private Long clientId;
    private String clientName;
    private Long providerId;
    private String providerName;
    private String providerAvatarUrl;
    private String preferredDate;
    private String preferredTime;
    private String jobDescription;
    private String status;
    private String declineReason;
    private String createdAt;

    public static BookingResponse from(Booking booking) {
        return BookingResponse.builder()
            .id(booking.getId())
            .clientId(booking.getClient().getId())
            .clientName(booking.getClient().getFullName())
            .providerId(booking.getProvider().getId())
            .providerName(booking.getProvider().getUser().getFullName())
            .providerAvatarUrl(booking.getProvider().getAvatarUrl())
            .preferredDate(booking.getPreferredDate().toString())
            .preferredTime(booking.getPreferredTime().toString())
            .jobDescription(booking.getJobDescription())
            .status(booking.getStatus().name())
            .declineReason(booking.getDeclineReason())
            .createdAt(booking.getCreatedAt().toString())
            .build();
    }
}
