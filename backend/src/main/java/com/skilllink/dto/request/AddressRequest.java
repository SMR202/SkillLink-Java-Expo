package com.skilllink.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AddressRequest {

    private String label; // "Home", "Office"

    @NotBlank(message = "Street address is required")
    private String streetAddress;

    private String city;
    private String area;
    private Boolean isPrimary;
}
