package com.skilllink.service;

import com.skilllink.dto.response.AdminUserResponse;
import com.skilllink.dto.response.AnalyticsResponse;
import com.skilllink.entity.*;
import com.skilllink.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @InjectMocks private AdminService adminService;
    @Mock private UserRepository userRepository;
    @Mock private BookingRepository bookingRepository;
    @Mock private ReviewRepository reviewRepository;
    @Mock private PaymentRepository paymentRepository;
    @Mock private AuditLogRepository auditLogRepository;

    private User admin;
    private User client;

    @BeforeEach
    void setUp() {
        admin = User.builder().id(99L).fullName("Admin").email("admin@test.com").role(Role.ADMIN).isActive(true).emailVerified(true).build();
        client = User.builder().id(1L).fullName("Client One").email("client@test.com").role(Role.CLIENT).isActive(true).emailVerified(false).build();
    }

    @Test
    @DisplayName("Should search users by text before role filter")
    void getAllUsers_usesSearchWhenPresent() {
        when(userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase("client", "client", PageRequest.of(0, 10)))
            .thenReturn(new PageImpl<>(List.of(client)));

        var page = adminService.getAllUsers("client", "PROVIDER", PageRequest.of(0, 10));

        assertEquals(1, page.getTotalElements());
        verify(userRepository, never()).findByRole(any(), any());
    }

    @Test
    @DisplayName("Should suspend user and write audit log")
    void suspendUser_disablesTargetAndAudits() {
        when(userRepository.findById(99L)).thenReturn(Optional.of(admin));
        when(userRepository.findById(1L)).thenReturn(Optional.of(client));

        AdminUserResponse response = adminService.suspendUser(99L, 1L);

        assertFalse(response.getIsActive());
        verify(auditLogRepository).save(argThat(log -> log.getAction().equals("SUSPEND_USER") && log.getTargetId().equals(1L)));
    }

    @Test
    @DisplayName("Should sum only completed payment revenue")
    void getAnalytics_sumsCompletedPaymentsOnly() {
        Payment completed = Payment.builder()
            .status(PaymentStatus.COMPLETED)
            .amount(new BigDecimal("1000.00"))
            .platformFee(new BigDecimal("100.00"))
            .build();
        Payment pending = Payment.builder()
            .status(PaymentStatus.PENDING)
            .amount(new BigDecimal("5000.00"))
            .platformFee(new BigDecimal("500.00"))
            .build();
        when(userRepository.count()).thenReturn(3L);
        when(userRepository.countByRole(Role.CLIENT)).thenReturn(1L);
        when(userRepository.countByRole(Role.PROVIDER)).thenReturn(2L);
        when(bookingRepository.count()).thenReturn(4L);
        when(bookingRepository.countByStatus(BookingStatus.PENDING)).thenReturn(1L);
        when(bookingRepository.countByStatus(BookingStatus.COMPLETED)).thenReturn(2L);
        when(reviewRepository.count()).thenReturn(5L);
        when(paymentRepository.findAll()).thenReturn(List.of(completed, pending));

        AnalyticsResponse response = adminService.getAnalytics();

        assertEquals(new BigDecimal("1000.00"), response.getTotalRevenue());
        assertEquals(new BigDecimal("100.00"), response.getPlatformEarnings());
    }
}
