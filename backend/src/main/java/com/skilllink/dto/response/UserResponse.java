package com.skilllink.dto.response;

import com.skilllink.entity.User;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private Boolean emailVerified;
    private String createdAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
            .id(user.getId())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .role(user.getRole().name())
            .emailVerified(user.getEmailVerified())
            .createdAt(user.getCreatedAt().toString())
            .build();
    }
}
