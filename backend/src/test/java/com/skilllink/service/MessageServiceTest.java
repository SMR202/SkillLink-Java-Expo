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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @InjectMocks
    private MessageService messageService;
    @Mock
    private MessageRepository messageRepository;
    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private UserRepository userRepository;

    private User client;
    private User providerUser;
    private User otherUser;
    private ProviderProfile provider;
    private Booking booking;

    @BeforeEach
    void setUp() {
        client = User.builder().id(1L).fullName("Test Client").email("client@test.com").role(Role.CLIENT).build();
        providerUser = User.builder().id(2L).fullName("Test Provider").email("provider@test.com").role(Role.PROVIDER)
                .build();
        otherUser = User.builder().id(3L).fullName("Other User").email("other@test.com").role(Role.CLIENT).build();
        provider = ProviderProfile.builder().id(10L).user(providerUser).build();
        booking = Booking.builder()
                .id(100L)
                .client(client)
                .provider(provider)
                .preferredDate(LocalDate.now().plusDays(1))
                .preferredTime(LocalTime.of(10, 0))
                .jobDescription("Fix the leaking kitchen tap")
                .status(BookingStatus.ACCEPTED)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should throw when booking is not PENDING or ACCEPTED")
    void shouldThrow_whenBookingNotPendingOrAccepted() {
        booking.setStatus(BookingStatus.COMPLETED);
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        MessageRequest req = new MessageRequest();
        req.setBookingId(100L);
        req.setContent("Hello, when can you come?");

        assertThrows(ForbiddenException.class, () -> messageService.sendMessage(1L, req));
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

    @Test
    @DisplayName("Should mark messages as read when user is booking participant")
    void shouldMarkRead_whenParticipant() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        messageService.markAsRead(1L, 100L);

        verify(messageRepository, times(1)).markAllAsReadForBooking(100L, 1L);
    }

    @Test
    @DisplayName("Should throw when non-participant tries to mark messages as read")
    void shouldThrow_whenMarkReadByNonParticipant() {
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));

        assertThrows(ForbiddenException.class, () -> messageService.markAsRead(otherUser.getId(), 100L));

        verify(messageRepository, never()).markAllAsReadForBooking(anyLong(), anyLong());
    }

    @Test
    @DisplayName("Should return ordered messages for booking participant")
    void shouldReturnMessages_whenParticipant() {
        Message message = Message.builder()
                .id(5L)
                .booking(booking)
                .sender(providerUser)
                .content("I can arrive at 10")
                .isRead(false)
                .sentAt(LocalDateTime.now())
                .build();
        when(bookingRepository.findById(100L)).thenReturn(Optional.of(booking));
        when(messageRepository.findByBookingIdOrderBySentAtAsc(100L)).thenReturn(List.of(message));

        List<MessageResponse> responses = messageService.getMessages(providerUser.getId(), 100L);

        assertEquals(1, responses.size());
        assertEquals("I can arrive at 10", responses.get(0).getContent());
    }

    @Test
    @DisplayName("Should map conversation with last message and unread count")
    void shouldMapConversation_withLastMessageAndUnreadCount() {
        Message lastMessage = Message.builder()
                .id(6L)
                .booking(booking)
                .sender(client)
                .content("See you tomorrow")
                .isRead(false)
                .sentAt(LocalDateTime.now())
                .build();
        when(bookingRepository.findConversationsForUser(client.getId())).thenReturn(List.of(booking));
        when(messageRepository.findTopByBookingIdOrderBySentAtDesc(100L)).thenReturn(lastMessage);
        when(messageRepository.countUnreadByBookingIdAndNotSender(100L, client.getId())).thenReturn(2L);

        var conversations = messageService.getConversations(client.getId());

        assertEquals(1, conversations.size());
        assertEquals(providerUser.getId(), conversations.get(0).getOtherUserId());
        assertEquals("See you tomorrow", conversations.get(0).getLastMessage());
        assertEquals(2L, conversations.get(0).getUnreadCount());
    }
}
