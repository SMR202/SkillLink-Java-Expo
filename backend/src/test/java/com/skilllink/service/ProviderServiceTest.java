package com.skilllink.service;

import com.skilllink.dto.request.ProviderProfileUpdateRequest;
import com.skilllink.dto.response.ProviderResponse;
import com.skilllink.entity.ProviderProfile;
import com.skilllink.entity.Role;
import com.skilllink.entity.SkillCategory;
import com.skilllink.entity.User;
import com.skilllink.exception.BadRequestException;
import com.skilllink.repository.ProviderProfileRepository;
import com.skilllink.repository.SkillCategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProviderServiceTest {

    @InjectMocks private ProviderService providerService;
    @Mock private ProviderProfileRepository providerProfileRepository;
    @Mock private SkillCategoryRepository skillCategoryRepository;

    private ProviderProfile profile;
    private SkillCategory plumbing;

    @BeforeEach
    void setUp() {
        User providerUser = User.builder().id(2L).fullName("Provider One").email("provider@test.com").role(Role.PROVIDER).build();
        profile = ProviderProfile.builder().id(10L).user(providerUser).build();
        plumbing = SkillCategory.builder().id(7L).name("Plumbing").build();
    }

    @Test
    @DisplayName("Should mark profile complete when bio, skills, and city are present")
    void updateProfile_marksProfileComplete() {
        ProviderProfileUpdateRequest request = new ProviderProfileUpdateRequest(
            "I provide reliable home services with many years of practical field experience.",
            List.of(7L),
            List.of("https://example.com/work"),
            "Lahore",
            "03001234567");
        when(providerProfileRepository.findByUserId(2L)).thenReturn(Optional.of(profile));
        when(skillCategoryRepository.findAllById(List.of(7L))).thenReturn(List.of(plumbing));
        when(providerProfileRepository.save(any(ProviderProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        ProviderResponse response = providerService.updateProfile(2L, request);

        assertTrue(response.getProfileComplete());
        assertEquals("Lahore", response.getCity());
    }

    @Test
    @DisplayName("Should reject invalid skill IDs")
    void updateProfile_rejectsInvalidSkillIds() {
        ProviderProfileUpdateRequest request = new ProviderProfileUpdateRequest(null, List.of(7L, 8L), null, null, null);
        when(providerProfileRepository.findByUserId(2L)).thenReturn(Optional.of(profile));
        when(skillCategoryRepository.findAllById(List.of(7L, 8L))).thenReturn(List.of(plumbing));

        assertThrows(BadRequestException.class, () -> providerService.updateProfile(2L, request));
    }

    @Test
    @DisplayName("Should reject non-http portfolio links")
    void updateProfile_rejectsInvalidPortfolioUrl() {
        ProviderProfileUpdateRequest request = new ProviderProfileUpdateRequest(null, null, List.of("ftp://example.com"), null, null);
        when(providerProfileRepository.findByUserId(2L)).thenReturn(Optional.of(profile));

        assertThrows(BadRequestException.class, () -> providerService.updateProfile(2L, request));
    }
}
