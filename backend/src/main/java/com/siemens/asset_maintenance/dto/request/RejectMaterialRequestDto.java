package com.siemens.asset_maintenance.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectMaterialRequestDto {

    @NotBlank(message = "Rejection reason is required")
    private String rejectionReason;
}