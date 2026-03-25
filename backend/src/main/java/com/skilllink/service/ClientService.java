package com.skilllink.service;

import com.skilllink.dto.request.AddressRequest;
import com.skilllink.dto.request.ClientContactUpdateRequest;
import com.skilllink.entity.*;
import com.skilllink.exception.*;
import com.skilllink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientProfileRepository clientProfileRepository;

    @Transactional
    public ClientProfile updateContact(Long userId, ClientContactUpdateRequest request) {
        ClientProfile profile = clientProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Client profile not found."));

        if (request.getPhoneNumber() != null) {
            profile.setPhoneNumber(request.getPhoneNumber());
        }

        return clientProfileRepository.save(profile);
    }

    @Transactional
    public ClientProfile addAddress(Long userId, AddressRequest request) {
        ClientProfile profile = clientProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Client profile not found."));

        Address address = Address.builder()
            .clientProfile(profile)
            .label(request.getLabel())
            .streetAddress(request.getStreetAddress())
            .city(request.getCity())
            .area(request.getArea())
            .isPrimary(request.getIsPrimary() != null ? request.getIsPrimary() : false)
            .build();

        // If new address is primary, unset others
        if (address.getIsPrimary()) {
            profile.getAddresses().forEach(a -> a.setIsPrimary(false));
        }

        profile.getAddresses().add(address);
        return clientProfileRepository.save(profile);
    }

    public ClientProfile getClientProfile(Long userId) {
        return clientProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Client profile not found."));
    }
}
