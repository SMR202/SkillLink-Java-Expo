package com.skilllink.controller;

import com.skilllink.dto.response.AdminUserResponse;
import com.skilllink.dto.response.AnalyticsResponse;
import com.skilllink.dto.response.ApiResponse;
import com.skilllink.security.JwtTokenProvider;
import com.skilllink.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final JwtTokenProvider tokenProvider;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<AdminUserResponse>>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<AdminUserResponse> users = adminService.getAllUsers(search, role, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PutMapping("/users/{id}/suspend")
    public ResponseEntity<ApiResponse<AdminUserResponse>> suspendUser(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long adminId = getUserId(authHeader);
        AdminUserResponse response = adminService.suspendUser(adminId, id);
        return ResponseEntity.ok(ApiResponse.success("User suspended successfully", response));
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<ApiResponse<AdminUserResponse>> activateUser(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long adminId = getUserId(authHeader);
        AdminUserResponse response = adminService.activateUser(adminId, id);
        return ResponseEntity.ok(ApiResponse.success("User activated successfully", response));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics() {
        AnalyticsResponse response = adminService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    private Long getUserId(String authHeader) {
        return tokenProvider.getUserIdFromToken(authHeader.replace("Bearer ", ""));
    }
}
