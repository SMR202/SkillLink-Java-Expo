package com.skilllink.controller;

import com.skilllink.dto.request.BookingActionRequest;
import com.skilllink.dto.request.BookingRequest;
import com.skilllink.dto.response.ApiResponse;
import com.skilllink.dto.response.BookingResponse;
import com.skilllink.entity.BookingStatus;
import com.skilllink.security.JwtTokenProvider;
import com.skilllink.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody BookingRequest request) {
        Long userId = getUserIdFromHeader(authHeader);
        BookingResponse response = bookingService.createBooking(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Booking request submitted!", response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getMyBookings(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = getUserIdFromHeader(authHeader);
        String role = getRoleFromHeader(authHeader);

        Page<BookingResponse> bookings;
        if ("PROVIDER".equals(role)) {
            bookings = bookingService.getProviderBookings(userId, null, PageRequest.of(page, size));
        } else {
            bookings = bookingService.getClientBookings(userId, PageRequest.of(page, size));
        }
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/my/provider")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getProviderBookings(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = getUserIdFromHeader(authHeader);
        BookingStatus bookingStatus = status != null ? BookingStatus.valueOf(status.toUpperCase()) : null;
        Page<BookingResponse> bookings = bookingService.getProviderBookings(userId, bookingStatus, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @PutMapping("/{id}/action")
    public ResponseEntity<ApiResponse<BookingResponse>> actionBooking(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @Valid @RequestBody BookingActionRequest request) {
        Long userId = getUserIdFromHeader(authHeader);
        BookingResponse response = bookingService.actionBooking(userId, id, request);
        return ResponseEntity.ok(ApiResponse.success("Booking " + request.getAction() + "ed.", response));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<BookingResponse>> completeBooking(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = getUserIdFromHeader(authHeader);
        BookingResponse response = bookingService.completeBooking(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Booking marked as completed!", response));
    }

    private Long getUserIdFromHeader(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return tokenProvider.getUserIdFromToken(token);
    }

    private String getRoleFromHeader(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return tokenProvider.getRoleFromToken(token);
    }
}
