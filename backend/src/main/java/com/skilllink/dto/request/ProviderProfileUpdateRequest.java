package com.skilllink.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProviderProfileUpdateRequest {

    @Size(min = 50, max = 2000, message = "Bio must be between 50 and 2000 characters")
    private String bio;

    @Size(min = 1, max = 5, message = "Select between 1 and 5 skill categories")
    private List<Long> skillIds;

    private List<String> portfolioLinks;

    private String city;

    private String phoneNumber;
}
