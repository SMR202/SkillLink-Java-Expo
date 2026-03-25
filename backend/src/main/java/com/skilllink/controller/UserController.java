package com.skilllink.controller;

import com.skilllink.dto.response.ApiResponse;
import com.skilllink.dto.response.UserResponse;
import com.skilllink.entity.User;
import com.skilllink.exception.ResourceNotFoundException;
import com.skilllink.repository.UserRepository;
import com.skilllink.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromHeader(authHeader);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        return ResponseEntity.ok(ApiResponse.success(UserResponse.from(user)));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody java.util.Map<String, String> updates) {
        Long userId = getUserIdFromHeader(authHeader);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (updates.containsKey("fullName")) {
            user.setFullName(updates.get("fullName"));
        }

        user = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Profile updated.", UserResponse.from(user)));
    }

    private Long getUserIdFromHeader(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return tokenProvider.getUserIdFromToken(token);
    }
}
