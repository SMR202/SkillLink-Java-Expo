package com.skilllink.service;

import com.skilllink.dto.response.AdminUserResponse;
import com.skilllink.dto.response.AnalyticsResponse;
import com.skilllink.dto.response.ReviewResponse;
import com.skilllink.entity.*;
import com.skilllink.exception.ResourceNotFoundException;
import com.skilllink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final PaymentRepository paymentRepository;
    private final AuditLogRepository auditLogRepository;

    public Page<AdminUserResponse> getAllUsers(String search, String role, Pageable pageable) {
        Page<User> users;
        if (search != null && !search.isBlank()) {
            users = userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                search, search, pageable);
        } else if (role != null && !role.isBlank()) {
            users = userRepository.findByRole(Role.valueOf(role.toUpperCase()), pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        return users.map(this::mapToAdminUser);
    }

    @Transactional
    public AdminUserResponse suspendUser(Long adminId, Long targetUserId) {
        User admin = userRepository.findById(adminId)
            .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        User target = userRepository.findById(targetUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        target.setIsActive(false);
        userRepository.save(target);

        // Audit log
        AuditLog log = AuditLog.builder()
            .adminUser(admin)
            .action("SUSPEND_USER")
            .targetType("USER")
            .targetId(targetUserId)
            .details("Suspended user: " + target.getEmail())
            .build();
        auditLogRepository.save(log);

        return mapToAdminUser(target);
    }

    @Transactional
    public AdminUserResponse activateUser(Long adminId, Long targetUserId) {
        User admin = userRepository.findById(adminId)
            .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        User target = userRepository.findById(targetUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        target.setIsActive(true);
        userRepository.save(target);

        AuditLog log = AuditLog.builder()
            .adminUser(admin)
            .action("ACTIVATE_USER")
            .targetType("USER")
            .targetId(targetUserId)
            .details("Activated user: " + target.getEmail())
            .build();
        auditLogRepository.save(log);

        return mapToAdminUser(target);
    }

    public AnalyticsResponse getAnalytics() {
        long totalUsers = userRepository.count();
        long totalClients = userRepository.countByRole(Role.CLIENT);
        long totalProviders = userRepository.countByRole(Role.PROVIDER);
        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);
        long completedBookings = bookingRepository.countByStatus(BookingStatus.COMPLETED);
        long totalReviews = reviewRepository.count();

        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal platformEarnings = BigDecimal.ZERO;
        try {
            // Sum all payments
            var payments = paymentRepository.findAll();
            for (var p : payments) {
                if (p.getStatus() == PaymentStatus.COMPLETED) {
                    totalRevenue = totalRevenue.add(p.getAmount());
                    platformEarnings = platformEarnings.add(p.getPlatformFee());
                }
            }
        } catch (Exception ignored) {}

        return AnalyticsResponse.builder()
            .totalUsers(totalUsers)
            .totalClients(totalClients)
            .totalProviders(totalProviders)
            .totalBookings(totalBookings)
            .pendingBookings(pendingBookings)
            .completedBookings(completedBookings)
            .totalRevenue(totalRevenue)
            .platformEarnings(platformEarnings)
            .totalReviews(totalReviews)
            .averagePlatformRating(0.0)
            .build();
    }

    private AdminUserResponse mapToAdminUser(User user) {
        return AdminUserResponse.builder()
            .id(user.getId())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .role(user.getRole().name())
            .isActive(user.getIsActive())
            .emailVerified(user.getEmailVerified())
            .createdAt(user.getCreatedAt())
            .build();
    }

    public Page<ReviewResponse> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable).map(this::mapToReviewResponse);
    }

    @Transactional
    public void deleteReview(Long adminId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        reviewRepository.delete(review);
    }

    private ReviewResponse mapToReviewResponse(Review r) {
        return ReviewResponse.builder()
            .id(r.getId())
            .bookingId(r.getBooking().getId())
            .clientId(r.getClient().getId())
            .clientName(r.getClient().getFullName())
            .providerId(r.getProvider().getUser().getId())
            .providerName(r.getProvider().getUser().getFullName())
            .rating(r.getRating())
            .comment(r.getComment())
            .providerResponse(r.getProviderResponse())
            .createdAt(r.getCreatedAt())
            .respondedAt(r.getRespondedAt())
            .build();
    }
}
