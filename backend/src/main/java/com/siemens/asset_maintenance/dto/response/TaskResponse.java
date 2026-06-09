package com.siemens.asset_maintenance.dto.response;

import com.siemens.asset_maintenance.entity.enums.TaskPriority;
import com.siemens.asset_maintenance.entity.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String taskCode;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private TaskPriority priority;
    private TaskStatus status;

    private Long assetId;
    private String assetCode;
    private String assetName;

    private String reportedByEmail;
    private String assignedToEmail;
    private String assignedByEmail;

    private LocalDateTime createdAt;
    private LocalDateTime assignedAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime reviewedAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime updatedAt;
}