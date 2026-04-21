package com.skilllink.controller;

import com.skilllink.dto.request.PaymentCheckoutRequest;
import com.skilllink.dto.response.ApiResponse;
import com.skilllink.dto.response.EarningsResponse;
import com.skilllink.dto.response.PaymentResponse;
import com.skilllink.security.JwtTokenProvider;
import com.skilllink.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<PaymentResponse>> checkout(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody PaymentCheckoutRequest request) {
        Long userId = getUserId(authHeader);
        PaymentResponse response = paymentService.checkout(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Payment processed successfully!", response));
    }

    @GetMapping("/earnings")
    public ResponseEntity<ApiResponse<EarningsResponse>> getEarnings(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserId(authHeader);
        EarningsResponse response = paymentService.getEarnings(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<Page<PaymentResponse>>> getHistory(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = getUserId(authHeader);
        Page<PaymentResponse> payments = paymentService.getHistory(userId, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    private Long getUserId(String authHeader) {
        return tokenProvider.getUserIdFromToken(authHeader.replace("Bearer ", ""));
    }
}
