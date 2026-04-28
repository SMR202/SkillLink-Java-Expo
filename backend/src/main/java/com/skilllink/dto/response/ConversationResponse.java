package com.skilllink.dto.response;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ConversationResponse {
    private Long bookingId;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserAvatarUrl;
    private String bookingStatus;
    private String jobDescription;
    private String preferredDate;
    private String preferredTime;
    private String lastMessage;
    private String lastMessageAt;
    private Long unreadCount;
}
