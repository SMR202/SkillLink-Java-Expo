package com.skilllink.service;

import com.skilllink.dto.request.*;
import com.skilllink.dto.response.ProviderResponse;
import com.skilllink.entity.*;
import com.skilllink.exception.*;
import com.skilllink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderProfileRepository providerProfileRepository;
    private final SkillCategoryRepository skillCategoryRepository;

    public ProviderResponse getProviderProfile(Long providerId) {
        ProviderProfile profile = providerProfileRepository.findById(providerId)
            .orElseThrow(() -> new ResourceNotFoundException("Provider not found."));
        return ProviderResponse.from(profile);
    }

    public ProviderResponse getProviderByUserId(Long userId) {
        ProviderProfile profile = providerProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found."));
        return ProviderResponse.from(profile);
    }

    @Transactional
    public ProviderResponse updateProfile(Long userId, ProviderProfileUpdateRequest request) {
        ProviderProfile profile = providerProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found."));

        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }

        if (request.getSkillIds() != null) {
            List<SkillCategory> skills = skillCategoryRepository.findAllById(request.getSkillIds());
            if (skills.size() != request.getSkillIds().size()) {
                throw new BadRequestException("One or more skill categories are invalid.");
            }
            profile.setSkills(skills);
        }

        if (request.getPortfolioLinks() != null) {
            // Validate URLs
            for (String link : request.getPortfolioLinks()) {
                if (!link.matches("^https?://.*")) {
                    throw new BadRequestException("Invalid portfolio URL: " + link);
                }
            }
            profile.setPortfolioLinks(request.getPortfolioLinks());
        }

        if (request.getCity() != null) {
            profile.setCity(request.getCity());
        }

        if (request.getPhoneNumber() != null) {
            profile.setPhoneNumber(request.getPhoneNumber());
        }

        // Check if profile is complete
        boolean complete = profile.getBio() != null && profile.getBio().length() >= 50
            && profile.getSkills() != null && !profile.getSkills().isEmpty()
            && profile.getCity() != null && !profile.getCity().isBlank();
        profile.setProfileComplete(complete);

        profile = providerProfileRepository.save(profile);
        return ProviderResponse.from(profile);
    }

    public Page<ProviderResponse> searchProviders(String query, Long categoryId, String city,
                                                   Double minRating, Pageable pageable) {
        Page<ProviderProfile> results;

        if (categoryId != null) {
            results = providerProfileRepository.searchProvidersByCategory(query, categoryId, city, minRating, pageable);
        } else {
            results = providerProfileRepository.searchProviders(query, city, minRating, pageable);
        }

        return results.map(ProviderResponse::summary);
    }
}
