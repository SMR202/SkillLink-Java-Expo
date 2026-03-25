package com.skilllink.controller;

import com.skilllink.dto.request.ProviderProfileUpdateRequest;
import com.skilllink.dto.response.ApiResponse;
import com.skilllink.dto.response.ProviderResponse;
import com.skilllink.security.JwtTokenProvider;
import com.skilllink.service.ProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;
    private final JwtTokenProvider tokenProvider;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProviderResponse>> getProvider(@PathVariable Long id) {
        ProviderResponse response = providerService.getProviderProfile(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProviderResponse>> getMyProfile(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromHeader(authHeader);
        ProviderResponse response = providerService.getProviderByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<ProviderResponse>> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ProviderProfileUpdateRequest request) {
        Long userId = getUserIdFromHeader(authHeader);
        ProviderResponse response = providerService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully!", response));
    }

    private Long getUserIdFromHeader(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return tokenProvider.getUserIdFromToken(token);
    }
}
