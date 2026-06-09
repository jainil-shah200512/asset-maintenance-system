package com.siemens.asset_maintenance.dto.response;

import com.siemens.asset_maintenance.entity.enums.MaterialRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MaterialRequestResponse {
    private Long id;
    private Long taskId;
    private String taskCode;
    private String requestedByEmail;
    private String reviewedByEmail;
    private String materialDescription;
    private Integer quantity;
    private Integer approvedQuantity;
    private MaterialRequestStatus status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
}