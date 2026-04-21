package com.skilllink.service;

import com.skilllink.dto.request.MessageRequest;
import com.skilllink.dto.response.MessageResponse;
import com.skilllink.entity.*;
import com.skilllink.exception.ForbiddenException;
import com.skilllink.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @InjectMocks private MessageService messageService;
    @Mock private MessageRepository messageRepository;
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
    @DisplayName("Should throw when booking is not PENDING or ACCEPTED")
    void shouldThrow_whenBookingNotPendingOrAccepted() {
        booking.setStatus(BookingStatus.COMPLETED);
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        MessageRequest req = new MessageRequest();
        req.setBookingId(100L);
        req.setContent("Hello, when can you come?");

        assertThrows(ForbiddenException.class, () ->
            messageService.sendMessage(1L, req));
    }

    @Test
    @DisplayName("Should send message when valid")
    void shouldSend_whenValid() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(userRepository.findById(1L)).thenReturn(Optional.of(client));
        when(messageRepository.save(any(Message.class))).thenAnswer(inv -> {
            Message m = inv.getArgument(0);
            m.setId(1L);
            return m;
        });

        MessageRequest req = new MessageRequest();
        req.setBookingId(100L);
        req.setContent("Hello, when can you come?");

        MessageResponse res = messageService.sendMessage(1L, req);

        assertNotNull(res);
        assertEquals("Hello, when can you come?", res.getContent());
        assertEquals(1L, res.getSenderId());
        verify(messageRepository, times(1)).save(any(Message.class));
    }
}
