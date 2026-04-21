package com.skilllink.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MessageResponse {
    private Long id;
    private Long bookingId;
    private Long senderId;
    private String senderName;
    private String content;
    private Boolean isRead;
    private LocalDateTime sentAt;
}
