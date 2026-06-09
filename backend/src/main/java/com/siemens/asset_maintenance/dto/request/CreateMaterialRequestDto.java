package com.siemens.asset_maintenance.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateMaterialRequestDto {

    @NotNull(message = "Task ID is required")
    private Long taskId;

    @NotBlank(message = "Material description is required")
    private String materialDescription;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
}