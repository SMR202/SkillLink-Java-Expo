package com.skilllink.service;

import com.skilllink.dto.request.LoginRequest;
import com.skilllink.dto.request.SignupRequest;
import com.skilllink.dto.response.AuthResponse;
import com.skilllink.entity.Role;
import com.skilllink.entity.User;
import com.skilllink.exception.BadRequestException;
import com.skilllink.exception.UnauthorizedException;
import com.skilllink.repository.ClientProfileRepository;
import com.skilllink.repository.ProviderProfileRepository;
import com.skilllink.repository.UserRepository;
import com.skilllink.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @InjectMocks private AuthService authService;
    @Mock private UserRepository userRepository;
    @Mock private ProviderProfileRepository providerProfileRepository;
    @Mock private ClientProfileRepository clientProfileRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider tokenProvider;

    private User client;

    @BeforeEach
    void setUp() {
        client = User.builder()
            .id(1L)
            .fullName("Client One")
            .email("client@test.com")
            .passwordHash("encoded-old")
            .role(Role.CLIENT)
            .isActive(true)
            .emailVerified(false)
            .build();
    }

    @Test
    @DisplayName("Should create client profile and tokens during client signup")
    void signup_createsClientProfileAndTokens() {
        SignupRequest request = new SignupRequest("Client One", "client@test.com", "Strong1!", "CLIENT");
        when(userRepository.existsByEmail("client@test.com")).thenReturn(false);
        when(passwordEncoder.encode("Strong1!")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User user = inv.getArgument(0);
            user.setId(1L);
            user.setCreatedAt(LocalDateTime.now());
            return user;
        });
        when(tokenProvider.generateAccessToken(1L, "client@test.com", "CLIENT")).thenReturn("access");
        when(tokenProvider.generateRefreshToken(1L)).thenReturn("refresh");

        AuthResponse response = authService.signup(request);

        assertEquals("access", response.getAccessToken());
        assertEquals("refresh", response.getRefreshToken());
        verify(clientProfileRepository).save(argThat(profile -> profile.getUser().getId().equals(1L)));
        verify(providerProfileRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should reject signup when email already exists")
    void signup_rejectsDuplicateEmail() {
        when(userRepository.existsByEmail("client@test.com")).thenReturn(true);

        assertThrows(BadRequestException.class,
            () -> authService.signup(new SignupRequest("Client One", "client@test.com", "Strong1!", "CLIENT")));
    }

    @Test
    @DisplayName("Should reject login for inactive user before password check")
    void login_rejectsInactiveUser() {
        client.setIsActive(false);
        when(userRepository.findByEmail("client@test.com")).thenReturn(Optional.of(client));

        assertThrows(UnauthorizedException.class,
            () -> authService.login(new LoginRequest("client@test.com", "wrong")));

        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    @DisplayName("Should reject weak reset password without saving")
    void resetPassword_rejectsWeakPassword() {
        client.setPasswordResetToken("token");
        client.setResetTokenExpiry(LocalDateTime.now().plusMinutes(10));
        when(userRepository.findByPasswordResetToken("token")).thenReturn(Optional.of(client));

        assertThrows(BadRequestException.class, () -> authService.resetPassword("token", "weak"));

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should change password when current password matches and new one is strong")
    void changePassword_updatesEncodedPassword() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(client));
        when(passwordEncoder.matches("Old1!", "encoded-old")).thenReturn(true);
        when(passwordEncoder.matches("Newpass1!", "encoded-old")).thenReturn(false);
        when(passwordEncoder.encode("Newpass1!")).thenReturn("encoded-new");

        authService.changePassword(1L, "Old1!", "Newpass1!");

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals("encoded-new", captor.getValue().getPasswordHash());
    }

    @Test
    @DisplayName("Should reject invalid refresh token")
    void refreshToken_rejectsInvalidToken() {
        when(tokenProvider.validateToken("bad-token")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.refreshToken("bad-token"));

        verify(userRepository, never()).findById(anyLong());
    }
}
