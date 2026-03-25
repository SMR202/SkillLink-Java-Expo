package com.skilllink.controller;

import com.skilllink.dto.request.LoginRequest;
import com.skilllink.dto.request.SignupRequest;
import com.skilllink.dto.response.ApiResponse;
import com.skilllink.dto.response.AuthResponse;
import com.skilllink.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Account created successfully!", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful!", response));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody Map<String, String> body) {
        String token = authService.forgotPassword(body.get("email"));
        // In production, don't return the token - send via email
        return ResponseEntity.ok(ApiResponse.success("Password reset link sent to your email.", token));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody Map<String, String> body) {
        authService.resetPassword(body.get("token"), body.get("newPassword"));
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully!", null));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody Map<String, String> body) {
        AuthResponse response = authService.refreshToken(body.get("refreshToken"));
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
