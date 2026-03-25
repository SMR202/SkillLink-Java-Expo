package com.skilllink.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ClientContactUpdateRequest {

    @Pattern(regexp = "^\\d{11}$", message = "Phone number must be exactly 11 digits")
    private String phoneNumber;
}
