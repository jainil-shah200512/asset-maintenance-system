package com.siemens.asset_maintenance.dto.request;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class ApproveMaterialRequestDto {

    @Min(value = 1, message = "Approved quantity must be at least 1")
    private Integer approvedQuantity;

    private String remarks;
}