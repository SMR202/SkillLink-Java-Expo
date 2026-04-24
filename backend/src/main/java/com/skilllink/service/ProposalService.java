package com.skilllink.service;

import com.skilllink.dto.request.ProposalAcceptRequest;
import com.skilllink.dto.request.ProposalRequest;
import com.skilllink.dto.response.BookingResponse;
import com.skilllink.dto.response.ProposalResponse;
import com.skilllink.entity.*;
import com.skilllink.exception.BadRequestException;
import com.skilllink.exception.ForbiddenException;
import com.skilllink.exception.ResourceNotFoundException;
import com.skilllink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class ProposalService {

    private final JobPostRepository jobPostRepository;
    private final ProposalRepository proposalRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public ProposalResponse submit(Long providerUserId, Long jobId, ProposalRequest request) {
        ProviderProfile provider = providerProfileRepository.findByUserId(providerUserId)
            .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));
        JobPost job = jobPostRepository.findById(jobId)
            .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new BadRequestException("This job is no longer open");
        }
        if (job.getClient().getId().equals(providerUserId)) {
            throw new ForbiddenException("You cannot apply to your own job");
        }
        if (proposalRepository.existsByJobPostIdAndProviderId(jobId, provider.getId())) {
            throw new BadRequestException("You have already applied to this job");
        }

        Proposal proposal = Proposal.builder()
            .jobPost(job)
            .provider(provider)
            .coverMessage(request.getCoverMessage())
            .proposedPrice(request.getProposedPrice())
            .estimatedDeliveryTime(request.getEstimatedDeliveryTime())
            .status(ProposalStatus.PENDING)
            .build();
        return ProposalResponse.from(proposalRepository.save(proposal));
    }

    public java.util.List<ProposalResponse> getForJob(Long clientId, Long jobId) {
        JobPost job = jobPostRepository.findById(jobId)
            .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (!job.getClient().getId().equals(clientId)) {
            throw new ForbiddenException("You can only view proposals for your own jobs");
        }
        return proposalRepository.findByJobPostIdOrderByCreatedAtDesc(jobId)
            .stream().map(ProposalResponse::from).toList();
    }

    public Page<ProposalResponse> getMine(Long providerUserId, Pageable pageable) {
        ProviderProfile provider = providerProfileRepository.findByUserId(providerUserId)
            .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));
        return proposalRepository.findByProviderIdOrderByCreatedAtDesc(provider.getId(), pageable)
            .map(ProposalResponse::from);
    }

    @Transactional
    public BookingResponse accept(Long clientId, Long proposalId, ProposalAcceptRequest request) {
        Proposal proposal = proposalRepository.findById(proposalId)
            .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));
        JobPost job = proposal.getJobPost();

        if (!job.getClient().getId().equals(clientId)) {
            throw new ForbiddenException("Only the job owner can accept proposals");
        }
        if (job.getStatus() != JobStatus.OPEN || proposal.getStatus() != ProposalStatus.PENDING) {
            throw new BadRequestException("This proposal cannot be accepted");
        }

        Booking booking = Booking.builder()
            .client(job.getClient())
            .provider(proposal.getProvider())
            .preferredDate(LocalDate.parse(request.getPreferredDate()))
            .preferredTime(LocalTime.parse(request.getPreferredTime()))
            .jobDescription(job.getTitle() + "\n\n" + job.getDescription())
            .status(BookingStatus.PENDING)
            .build();
        booking = bookingRepository.save(booking);

        proposal.setStatus(ProposalStatus.ACCEPTED);
        proposal.setBooking(booking);
        job.setStatus(JobStatus.FILLED);

        proposalRepository.findByJobPostIdOrderByCreatedAtDesc(job.getId()).forEach(other -> {
            if (!other.getId().equals(proposal.getId()) && other.getStatus() == ProposalStatus.PENDING) {
                other.setStatus(ProposalStatus.DECLINED);
                proposalRepository.save(other);
            }
        });

        proposalRepository.save(proposal);
        jobPostRepository.save(job);
        return BookingResponse.from(booking);
    }
}
