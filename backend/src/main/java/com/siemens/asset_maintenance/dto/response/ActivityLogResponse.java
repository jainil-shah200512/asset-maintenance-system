package com.siemens.asset_maintenance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ActivityLogResponse {
    private Long id;
    private Long taskId;
    private String performedByEmail;
    private String action;
    private String oldStatus;
    private String newStatus;
    private String remarks;
    private LocalDateTime createdAt;
}
