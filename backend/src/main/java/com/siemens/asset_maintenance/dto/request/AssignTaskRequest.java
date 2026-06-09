package com.siemens.asset_maintenance.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignTaskRequest {

    @NotNull(message = "Technician ID is required")
    private Long technicianId;

    private String remarks;
}