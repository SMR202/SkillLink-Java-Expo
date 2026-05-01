package com.skilllink.service;

import com.skilllink.dto.request.BookingActionRequest;
import com.skilllink.dto.request.BookingRequest;
import com.skilllink.dto.response.BookingResponse;
import com.skilllink.entity.*;
import com.skilllink.exception.BadRequestException;
import com.skilllink.exception.ForbiddenException;
import com.skilllink.exception.UnauthorizedException;
import com.skilllink.repository.BookingRepository;
import com.skilllink.repository.NotificationRepository;
import com.skilllink.repository.ProviderProfileRepository;
import com.skilllink.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @InjectMocks private BookingService bookingService;
    @Mock private BookingRepository bookingRepository;
    @Mock private UserRepository userRepository;
    @Mock private ProviderProfileRepository providerProfileRepository;
    @Mock private NotificationRepository notificationRepository;

    private User client;
    private User providerUser;
    private ProviderProfile provider;
    private Booking booking;

    @BeforeEach
    void setUp() {
        client = User.builder().id(1L).fullName("Client One").email("client@test.com").role(Role.CLIENT).isActive(true).build();
        providerUser = User.builder().id(2L).fullName("Provider One").email("provider@test.com").role(Role.PROVIDER).isActive(true).build();
        provider = ProviderProfile.builder().id(10L).user(providerUser).build();
        booking = Booking.builder()
            .id(100L)
            .client(client)
            .provider(provider)
            .preferredDate(LocalDate.now().plusDays(1))
            .preferredTime(LocalTime.of(10, 0))
            .jobDescription("Paint the living room wall")
            .status(BookingStatus.PENDING)
            .createdAt(LocalDateTime.now())
            .build();
    }

    @Test
    @DisplayName("Should create pending booking and notify provider")
    void createBooking_savesBookingAndNotification() {
        BookingRequest request = new BookingRequest(10L, LocalDate.now().plusDays(2).toString(), "11:30", "Fix the kitchen plumbing issue");
        when(userRepository.findById(1L)).thenReturn(Optional.of(client));
        when(providerProfileRepository.findById(10L)).thenReturn(Optional.of(provider));
        when(bookingRepository.findByProviderIdAndPreferredDateAndPreferredTimeAndStatusNot(eq(10L), any(), any(), eq(BookingStatus.DECLINED)))
            .thenReturn(List.of());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> {
            Booking saved = inv.getArgument(0);
            saved.setId(101L);
            saved.setCreatedAt(LocalDateTime.now());
            return saved;
        });

        BookingResponse response = bookingService.createBooking(1L, request);

        assertEquals("PENDING", response.getStatus());
        verify(notificationRepository).save(argThat(n -> n.getType().equals("BOOKING_NEW") && n.getRecipient().equals(providerUser)));
    }

    @Test
    @DisplayName("Should reject booking creation for unavailable provider slot")
    void createBooking_rejectsConflictingSlot() {
        BookingRequest request = new BookingRequest(10L, LocalDate.now().plusDays(2).toString(), "11:30", "Fix the kitchen plumbing issue");
        when(userRepository.findById(1L)).thenReturn(Optional.of(client));
        when(providerProfileRepository.findById(10L)).thenReturn(Optional.of(provider));
        when(bookingRepository.findByProviderIdAndPreferredDateAndPreferredTimeAndStatusNot(eq(10L), any(), any(), eq(BookingStatus.DECLINED)))
            .thenReturn(List.of(booking));

        assertThrows(BadRequestException.class, () -> bookingService.createBooking(1L, request));

        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should accept pending booking by assigned provider")
    void actionBooking_acceptsPendingBooking() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        BookingResponse response = bookingService.actionBooking(2L, 100L, new BookingActionRequest("accept", null));

        assertEquals("ACCEPTED", response.getStatus());
        verify(notificationRepository).save(argThat(n -> n.getType().equals("BOOKING_ACCEPTED")));
    }

    @Test
    @DisplayName("Should require decline reason")
    void actionBooking_rejectsDeclineWithoutReason() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        assertThrows(BadRequestException.class,
            () -> bookingService.actionBooking(2L, 100L, new BookingActionRequest("decline", " ")));
    }

    @Test
    @DisplayName("Should complete only paid bookings by client")
    void completeBooking_marksPaidBookingCompleted() {
        booking.setStatus(BookingStatus.PAID);
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));

        BookingResponse response = bookingService.completeBooking(1L, 100L);

        assertEquals("COMPLETED", response.getStatus());
        verify(notificationRepository).save(argThat(n -> n.getType().equals("BOOKING_COMPLETED") && n.getRecipient().equals(providerUser)));
    }

    @Test
    @DisplayName("Should forbid unrelated users from viewing booking")
    void getBooking_forbidsNonParticipant() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        assertThrows(ForbiddenException.class, () -> bookingService.getBooking(99L, 100L));
    }

    @Test
    @DisplayName("Should reject provider action from wrong provider user")
    void actionBooking_rejectsWrongProvider() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        assertThrows(UnauthorizedException.class,
            () -> bookingService.actionBooking(99L, 100L, new BookingActionRequest("accept", null)));
    }
}
