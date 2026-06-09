package com.siemens.asset_maintenance.dto.request;

import com.siemens.asset_maintenance.entity.enums.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateTaskRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    private LocalDateTime dueDate;

    @NotNull(message = "Task priority is required")
    private TaskPriority priority;

    private Long assetId; // optional
}