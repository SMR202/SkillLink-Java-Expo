package com.skilllink.controller;

import com.skilllink.dto.request.AddressRequest;
import com.skilllink.dto.request.ClientContactUpdateRequest;
import com.skilllink.dto.response.ApiResponse;
import com.skilllink.entity.ClientProfile;
import com.skilllink.security.JwtTokenProvider;
import com.skilllink.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;
    private final JwtTokenProvider tokenProvider;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ClientProfile>> getMyProfile(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromHeader(authHeader);
        ClientProfile profile = clientService.getClientProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/contact")
    public ResponseEntity<ApiResponse<ClientProfile>> updateContact(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ClientContactUpdateRequest request) {
        Long userId = getUserIdFromHeader(authHeader);
        ClientProfile profile = clientService.updateContact(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Contact updated successfully!", profile));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<ClientProfile>> addAddress(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody AddressRequest request) {
        Long userId = getUserIdFromHeader(authHeader);
        ClientProfile profile = clientService.addAddress(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Address added successfully!", profile));
    }

    private Long getUserIdFromHeader(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return tokenProvider.getUserIdFromToken(token);
    }
}
