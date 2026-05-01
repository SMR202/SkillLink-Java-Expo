package com.skilllink.service;

import com.skilllink.dto.request.ProposalAcceptRequest;
import com.skilllink.dto.request.ProposalRequest;
import com.skilllink.dto.response.BookingResponse;
import com.skilllink.dto.response.ProposalResponse;
import com.skilllink.entity.*;
import com.skilllink.exception.BadRequestException;
import com.skilllink.exception.ForbiddenException;
import com.skilllink.repository.BookingRepository;
import com.skilllink.repository.JobPostRepository;
import com.skilllink.repository.ProposalRepository;
import com.skilllink.repository.ProviderProfileRepository;
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
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProposalServiceTest {

    @InjectMocks private ProposalService proposalService;
    @Mock private JobPostRepository jobPostRepository;
    @Mock private ProposalRepository proposalRepository;
    @Mock private ProviderProfileRepository providerProfileRepository;
    @Mock private BookingRepository bookingRepository;

    private User client;
    private User providerUser;
    private ProviderProfile provider;
    private JobPost job;
    private Proposal proposal;

    @BeforeEach
    void setUp() {
        client = User.builder().id(1L).fullName("Client One").email("client@test.com").role(Role.CLIENT).build();
        providerUser = User.builder().id(2L).fullName("Provider One").email("provider@test.com").role(Role.PROVIDER).build();
        provider = ProviderProfile.builder().id(10L).user(providerUser).avgRating(4.8).build();
        job = JobPost.builder()
            .id(50L)
            .client(client)
            .category(SkillCategory.builder().id(3L).name("Electrical").build())
            .title("Install lights")
            .description("Install ceiling lights in two rooms")
            .budget(new BigDecimal("12000"))
            .status(JobStatus.OPEN)
            .createdAt(LocalDateTime.now())
            .build();
        proposal = Proposal.builder()
            .id(70L)
            .jobPost(job)
            .provider(provider)
            .coverMessage("I can complete this job professionally.")
            .proposedPrice(new BigDecimal("11000"))
            .estimatedDeliveryTime("2 days")
            .status(ProposalStatus.PENDING)
            .createdAt(LocalDateTime.now())
            .build();
    }

    @Test
    @DisplayName("Should submit pending proposal for open job")
    void submit_savesPendingProposal() {
        when(providerProfileRepository.findByUserId(2L)).thenReturn(Optional.of(provider));
        when(jobPostRepository.findById(50L)).thenReturn(Optional.of(job));
        when(proposalRepository.existsByJobPostIdAndProviderId(50L, 10L)).thenReturn(false);
        when(proposalRepository.save(any(Proposal.class))).thenAnswer(inv -> {
            Proposal saved = inv.getArgument(0);
            saved.setId(71L);
            saved.setCreatedAt(LocalDateTime.now());
            return saved;
        });

        ProposalResponse response = proposalService.submit(2L, 50L,
            new ProposalRequest("I can complete this job professionally.", new BigDecimal("11000"), "2 days"));

        assertEquals("PENDING", response.getStatus());
    }

    @Test
    @DisplayName("Should reject duplicate proposal")
    void submit_rejectsDuplicateProposal() {
        when(providerProfileRepository.findByUserId(2L)).thenReturn(Optional.of(provider));
        when(jobPostRepository.findById(50L)).thenReturn(Optional.of(job));
        when(proposalRepository.existsByJobPostIdAndProviderId(50L, 10L)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> proposalService.submit(2L, 50L,
            new ProposalRequest("I can complete this job professionally.", BigDecimal.TEN, "2 days")));
    }

    @Test
    @DisplayName("Should forbid non-owner from viewing job proposals")
    void getForJob_forbidsNonOwner() {
        when(jobPostRepository.findById(50L)).thenReturn(Optional.of(job));

        assertThrows(ForbiddenException.class, () -> proposalService.getForJob(99L, 50L));
    }

    @Test
    @DisplayName("Should accept proposal, create booking, fill job, and decline other pending proposals")
    void accept_createsBookingAndDeclinesOtherProposals() {
        Proposal otherProposal = Proposal.builder().id(71L).jobPost(job).provider(provider).status(ProposalStatus.PENDING).build();
        when(proposalRepository.findById(70L)).thenReturn(Optional.of(proposal));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> {
            Booking booking = inv.getArgument(0);
            booking.setId(100L);
            booking.setCreatedAt(LocalDateTime.now());
            return booking;
        });
        when(proposalRepository.findByJobPostIdOrderByCreatedAtDesc(50L)).thenReturn(List.of(proposal, otherProposal));

        BookingResponse response = proposalService.accept(1L, 70L,
            new ProposalAcceptRequest(LocalDate.now().plusDays(1).toString(), LocalTime.of(14, 0).toString()));

        assertEquals(100L, response.getId());
        assertEquals(JobStatus.FILLED, job.getStatus());
        assertEquals(ProposalStatus.ACCEPTED, proposal.getStatus());
        assertEquals(ProposalStatus.DECLINED, otherProposal.getStatus());
        verify(jobPostRepository).save(job);
    }

    @Test
    @DisplayName("Should reject accepting proposal by non-owner")
    void accept_rejectsNonOwner() {
        when(proposalRepository.findById(70L)).thenReturn(Optional.of(proposal));

        assertThrows(ForbiddenException.class, () -> proposalService.accept(99L, 70L,
            new ProposalAcceptRequest(LocalDate.now().plusDays(1).toString(), "14:00")));
    }
}
