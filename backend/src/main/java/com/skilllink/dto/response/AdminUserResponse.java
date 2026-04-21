package com.skilllink.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminUserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private Boolean isActive;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
}
