package com.skilllink.service;

import com.skilllink.dto.request.AddressRequest;
import com.skilllink.dto.request.ClientContactUpdateRequest;
import com.skilllink.entity.Address;
import com.skilllink.entity.ClientProfile;
import com.skilllink.exception.ResourceNotFoundException;
import com.skilllink.repository.ClientProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @InjectMocks private ClientService clientService;
    @Mock private ClientProfileRepository clientProfileRepository;

    private ClientProfile profile;

    @BeforeEach
    void setUp() {
        profile = ClientProfile.builder().id(1L).build();
        profile.getAddresses().add(Address.builder().label("Home").isPrimary(true).build());
    }

    @Test
    @DisplayName("Should update phone number when provided")
    void updateContact_updatesPhoneNumber() {
        when(clientProfileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));
        when(clientProfileRepository.save(any(ClientProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        ClientProfile saved = clientService.updateContact(1L, new ClientContactUpdateRequest("03001234567"));

        assertEquals("03001234567", saved.getPhoneNumber());
    }

    @Test
    @DisplayName("Should unset existing primary address when adding new primary")
    void addAddress_unsetsExistingPrimary() {
        when(clientProfileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));
        when(clientProfileRepository.save(any(ClientProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        ClientProfile saved = clientService.addAddress(1L,
            new AddressRequest("Office", "Main Road", "Lahore", "Gulberg", true));

        assertFalse(saved.getAddresses().get(0).getIsPrimary());
        assertTrue(saved.getAddresses().get(1).getIsPrimary());
    }

    @Test
    @DisplayName("Should throw when client profile is missing")
    void getClientProfile_throwsWhenMissing() {
        when(clientProfileRepository.findByUserId(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> clientService.getClientProfile(1L));
    }
}
