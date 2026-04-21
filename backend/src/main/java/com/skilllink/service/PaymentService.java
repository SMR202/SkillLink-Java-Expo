package com.skilllink.service;

import com.skilllink.dto.request.PaymentCheckoutRequest;
import com.skilllink.dto.response.EarningsResponse;
import com.skilllink.dto.response.PaymentResponse;
import com.skilllink.entity.*;
import com.skilllink.exception.*;
import com.skilllink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    private static final BigDecimal PLATFORM_FEE_RATE = new BigDecimal("0.10"); // 10%
    private static final BigDecimal DEFAULT_SERVICE_AMOUNT = new BigDecimal("5000.00"); // PKR 5000 default

    @Transactional
    public PaymentResponse checkout(Long userId, PaymentCheckoutRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify user is the client
        if (!booking.getClient().getId().equals(userId)) {
            throw new ForbiddenException("Only the client can make a payment");
        }

        // Verify booking is ACCEPTED
        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new ForbiddenException("Payment can only be made for accepted bookings");
        }

        // Check for duplicate payment
        if (paymentRepository.existsByBookingId(request.getBookingId())) {
            throw new BadRequestException("Payment already exists for this booking");
        }

        // Calculate fees
        BigDecimal amount = request.getAmount() != null
            ? BigDecimal.valueOf(request.getAmount())
            : DEFAULT_SERVICE_AMOUNT;
        BigDecimal platformFee = amount.multiply(PLATFORM_FEE_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal providerEarnings = amount.subtract(platformFee);

        User client = booking.getClient();
        User providerUser = booking.getProvider().getUser();

        // Simulate payment processing (auto-confirm)
        Payment payment = Payment.builder()
            .booking(booking)
            .client(client)
            .provider(providerUser)
            .amount(amount)
            .platformFee(platformFee)
            .providerEarnings(providerEarnings)
            .status(PaymentStatus.COMPLETED)
            .paymentMethod(request.getPaymentMethod())
            .paymentToken(request.getPaymentToken())
            .transactionRef("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
            .paidAt(LocalDateTime.now())
            .build();

        payment = paymentRepository.save(payment);

        // Update booking status to PAID
        booking.setStatus(BookingStatus.PAID);
        bookingRepository.save(booking);

        return mapToResponse(payment);
    }

    public EarningsResponse getEarnings(Long userId) {
        // Find provider user
        BigDecimal totalEarnings = paymentRepository.sumEarningsByProviderId(userId);
        Long completedPayments = paymentRepository.countCompletedByProviderId(userId);

        return EarningsResponse.builder()
            .totalEarnings(totalEarnings != null ? totalEarnings : BigDecimal.ZERO)
            .pendingPayouts(BigDecimal.ZERO) // simulated
            .thisMonthEarnings(totalEarnings != null ? totalEarnings : BigDecimal.ZERO)
            .completedPayments(completedPayments != null ? completedPayments : 0L)
            .totalBookingsCompleted(completedPayments != null ? completedPayments : 0L)
            .build();
    }

    public Page<PaymentResponse> getHistory(Long userId, Pageable pageable) {
        return paymentRepository.findByClientIdOrderByCreatedAtDesc(userId, pageable)
            .map(this::mapToResponse);
    }

    public Page<PaymentResponse> getProviderHistory(Long userId, Pageable pageable) {
        return paymentRepository.findByProviderIdOrderByPaidAtDesc(userId, pageable)
            .map(this::mapToResponse);
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
            .id(payment.getId())
            .bookingId(payment.getBooking().getId())
            .clientName(payment.getClient().getFullName())
            .providerName(payment.getProvider().getFullName())
            .amount(payment.getAmount())
            .platformFee(payment.getPlatformFee())
            .providerEarnings(payment.getProviderEarnings())
            .status(payment.getStatus().name())
            .paymentMethod(payment.getPaymentMethod())
            .transactionRef(payment.getTransactionRef())
            .paidAt(payment.getPaidAt())
            .build();
    }
}
