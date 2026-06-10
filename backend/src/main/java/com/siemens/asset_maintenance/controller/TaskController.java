package com.siemens.asset_maintenance.controller;

import com.siemens.asset_maintenance.dto.request.AssignTaskRequest;
import com.siemens.asset_maintenance.dto.request.CreateTaskRequest;
import com.siemens.asset_maintenance.dto.response.ActivityLogResponse;
import com.siemens.asset_maintenance.dto.response.TaskResponse;
import com.siemens.asset_maintenance.entity.enums.TaskPriority;
import com.siemens.asset_maintenance.entity.enums.TaskStatus;
import com.siemens.asset_maintenance.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.siemens.asset_maintenance.dto.request.TaskActionRequest;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity.ok(taskService.createTask(request));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority
    ) {
        return ResponseEntity.ok(taskService.getAllTasks(keyword, status, priority));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<TaskResponse> assignTask(
            @PathVariable Long id,
            @Valid @RequestBody AssignTaskRequest request
    ) {
        return ResponseEntity.ok(taskService.assignTask(id, request));
    }

    @PutMapping("/{id}/start")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<TaskResponse> startTask(
            @PathVariable Long id,
            @RequestBody(required = false) TaskActionRequest request
    ) {
        return ResponseEntity.ok(taskService.startTask(id, request));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('TECHNICIAN')")
    public ResponseEntity<TaskResponse> completeTask(
            @PathVariable Long id,
            @RequestBody(required = false) TaskActionRequest request
    ) {
        return ResponseEntity.ok(taskService.completeTask(id, request));
    }

    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<TaskResponse> confirmTask(
            @PathVariable Long id,
            @RequestBody(required = false) TaskActionRequest request
    ) {
        return ResponseEntity.ok(taskService.confirmTask(id, request));
    }

    @GetMapping("/{id}/activity-logs")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ActivityLogResponse>> getTaskActivityLogs(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskActivityLogs(id));
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<TaskResponse> closeTask(
            @PathVariable Long id,
            @RequestBody(required = false) TaskActionRequest request
    ) {
        return ResponseEntity.ok(taskService.closeTask(id, request));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<TaskResponse> rejectTask(
            @PathVariable Long id,
            @RequestBody TaskActionRequest request
    ) {
        return ResponseEntity.ok(taskService.rejectTask(id, request));
    }


}
