package com.skilllink.service;

import com.skilllink.dto.request.PaymentCheckoutRequest;
import com.skilllink.dto.response.PaymentResponse;
import com.skilllink.entity.*;
import com.skilllink.exception.BadRequestException;
import com.skilllink.exception.ForbiddenException;
import com.skilllink.exception.ResourceNotFoundException;
import com.skilllink.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @InjectMocks private PaymentService paymentService;
    @Mock private PaymentRepository paymentRepository;
    @Mock private BookingRepository bookingRepository;
    @Mock private UserRepository userRepository;

    private User client;
    private User providerUser;
    private ProviderProfile provider;
    private Booking booking;

    @BeforeEach
    void setUp() {
        client = User.builder().id(1L).fullName("Test Client").email("client@test.com").role(Role.CLIENT).build();
        providerUser = User.builder().id(2L).fullName("Test Provider").email("provider@test.com").role(Role.PROVIDER).build();
        provider = ProviderProfile.builder().id(10L).user(providerUser).build();
        booking = Booking.builder().id(100L).client(client).provider(provider).status(BookingStatus.ACCEPTED).build();
    }

    @Test
    @DisplayName("Should throw when booking is not ACCEPTED")
    void shouldThrow_whenBookingNotAccepted() {
        booking.setStatus(BookingStatus.PENDING);
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        PaymentCheckoutRequest req = new PaymentCheckoutRequest();
        req.setBookingId(100L);
        req.setPaymentMethod("CARD");
        req.setPaymentToken("tok_test_123");

        assertThrows(ForbiddenException.class, () ->
            paymentService.checkout(1L, req));
    }

    @Test
    @DisplayName("Should calculate 10% platform fee correctly")
    void shouldCalculateFees_correctly() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(paymentRepository.existsByBookingId(100L)).thenReturn(false);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> {
            Payment p = inv.getArgument(0);
            p.setId(1L);
            return p;
        });
        when(bookingRepository.save(any())).thenReturn(booking);

        PaymentCheckoutRequest req = new PaymentCheckoutRequest();
        req.setBookingId(100L);
        req.setPaymentMethod("CARD");
        req.setPaymentToken("tok_test_123");
        req.setAmount(10000.0);

        PaymentResponse res = paymentService.checkout(1L, req);

        assertEquals(0, new BigDecimal("10000.00").compareTo(res.getAmount()));
        assertEquals(0, new BigDecimal("1000.00").compareTo(res.getPlatformFee()));
        assertEquals(0, new BigDecimal("9000.00").compareTo(res.getProviderEarnings()));
    }

    @Test
    @DisplayName("Should complete payment when valid")
    void shouldCompletePayment_whenValid() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(paymentRepository.existsByBookingId(100L)).thenReturn(false);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> {
            Payment p = inv.getArgument(0);
            p.setId(1L);
            return p;
        });
        when(bookingRepository.save(any())).thenReturn(booking);

        PaymentCheckoutRequest req = new PaymentCheckoutRequest();
        req.setBookingId(100L);
        req.setPaymentMethod("CARD");
        req.setPaymentToken("tok_test_4242");

        PaymentResponse res = paymentService.checkout(1L, req);

        assertNotNull(res);
        assertEquals("COMPLETED", res.getStatus());
        assertNotNull(res.getTransactionRef());
        assertTrue(res.getTransactionRef().startsWith("TXN-"));
        verify(bookingRepository).save(argThat(b -> b.getStatus() == BookingStatus.PAID));
    }

    @Test
    @DisplayName("Should throw when duplicate payment exists")
    void shouldThrow_whenDuplicatePaymentExists() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(paymentRepository.existsByBookingId(100L)).thenReturn(true);

        PaymentCheckoutRequest req = new PaymentCheckoutRequest();
        req.setBookingId(100L);

        assertThrows(BadRequestException.class, () -> paymentService.checkout(1L, req));

        verify(paymentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw when non-client tries to pay")
    void shouldThrow_whenNonClientPays() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        PaymentCheckoutRequest req = new PaymentCheckoutRequest();
        req.setBookingId(100L);

        assertThrows(ForbiddenException.class, () -> paymentService.checkout(2L, req));
    }

    @Test
    @DisplayName("Should default null provider earnings to zero")
    void shouldDefaultNullEarningsToZero() {
        when(paymentRepository.sumEarningsByProviderId(2L)).thenReturn(null);
        when(paymentRepository.countCompletedByProviderId(2L)).thenReturn(null);

        var earnings = paymentService.getEarnings(2L);

        assertEquals(BigDecimal.ZERO, earnings.getTotalEarnings());
        assertEquals(0L, earnings.getCompletedPayments());
        assertEquals(0L, earnings.getTotalBookingsCompleted());
    }
}
