package com.skilllink.service;

import com.skilllink.dto.request.JobPostRequest;
import com.skilllink.dto.response.JobPostResponse;
import com.skilllink.entity.*;
import com.skilllink.exception.BadRequestException;
import com.skilllink.repository.JobPostRepository;
import com.skilllink.repository.SkillCategoryRepository;
import com.skilllink.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobPostServiceTest {

    @InjectMocks private JobPostService jobPostService;
    @Mock private JobPostRepository jobPostRepository;
    @Mock private UserRepository userRepository;
    @Mock private SkillCategoryRepository skillCategoryRepository;

    private User client;
    private SkillCategory category;

    @BeforeEach
    void setUp() {
        client = User.builder().id(1L).fullName("Client One").email("client@test.com").role(Role.CLIENT).build();
        category = SkillCategory.builder().id(3L).name("Electrical").build();
    }

    @Test
    @DisplayName("Should create open job post with future deadline")
    void create_savesOpenJob() {
        JobPostRequest request = new JobPostRequest("Install lights", 3L, "Install ceiling lights in two rooms", new BigDecimal("12000"), "Lahore", LocalDate.now().plusDays(5).toString());
        when(userRepository.findById(1L)).thenReturn(Optional.of(client));
        when(skillCategoryRepository.findById(3L)).thenReturn(Optional.of(category));
        when(jobPostRepository.save(any(JobPost.class))).thenAnswer(inv -> {
            JobPost job = inv.getArgument(0);
            job.setId(20L);
            job.setCreatedAt(LocalDateTime.now());
            return job;
        });

        JobPostResponse response = jobPostService.create(1L, request);

        assertEquals("OPEN", response.getStatus());
        assertEquals("Install lights", response.getTitle());
    }

    @Test
    @DisplayName("Should reject non-client job posts")
    void create_rejectsProviderUser() {
        User providerUser = User.builder().id(2L).role(Role.PROVIDER).build();
        when(userRepository.findById(2L)).thenReturn(Optional.of(providerUser));

        assertThrows(BadRequestException.class, () -> jobPostService.create(2L,
            new JobPostRequest("Install lights", 3L, "Install ceiling lights in two rooms", BigDecimal.TEN, "Lahore", null)));
    }

    @Test
    @DisplayName("Should reject past deadline")
    void create_rejectsPastDeadline() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(client));
        when(skillCategoryRepository.findById(3L)).thenReturn(Optional.of(category));

        assertThrows(BadRequestException.class, () -> jobPostService.create(1L,
            new JobPostRequest("Install lights", 3L, "Install ceiling lights in two rooms", BigDecimal.TEN, "Lahore", LocalDate.now().minusDays(1).toString())));
    }
}
