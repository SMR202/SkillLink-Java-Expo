package com.skilllink.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class JobPostRequest {
    @NotBlank(message = "Job title is required")
    @Size(max = 255)
    private String title;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotBlank(message = "Description is required")
    @Size(min = 20, max = 2000, message = "Description must be between 20 and 2000 characters")
    private String description;

    @NotNull(message = "Budget is required")
    @DecimalMin(value = "1.00", message = "Budget must be greater than zero")
    private BigDecimal budget;

    private String location;
    private String deadline;
}
