package com.siemens.asset_maintenance.service;

import com.siemens.asset_maintenance.dto.request.AssignTaskRequest;
import com.siemens.asset_maintenance.dto.request.CreateTaskRequest;
import com.siemens.asset_maintenance.dto.response.ActivityLogResponse;
import com.siemens.asset_maintenance.dto.response.TaskResponse;
import com.siemens.asset_maintenance.entity.*;
import com.siemens.asset_maintenance.entity.enums.RoleName;
import com.siemens.asset_maintenance.entity.enums.TaskPriority;
import com.siemens.asset_maintenance.entity.enums.TaskStatus;
import com.siemens.asset_maintenance.repository.ActivityLogRepository;
import com.siemens.asset_maintenance.repository.AssetRepository;
import com.siemens.asset_maintenance.repository.TaskRepository;
import com.siemens.asset_maintenance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.siemens.asset_maintenance.dto.request.TaskActionRequest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import org.springframework.transaction.annotation.Transactional;
import com.siemens.asset_maintenance.dto.response.ActivityLogResponse;
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final ActivityLogRepository activityLogRepository;

    public TaskResponse createTask(CreateTaskRequest request) {
        User currentUser = getCurrentUser();

        Task task = new Task();
        task.setTaskCode(generateTaskCode());
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setPriority(request.getPriority());
        task.setStatus(TaskStatus.REPORTED);
        task.setReportedBy(currentUser);
        task.setCreatedAt(LocalDateTime.now());

        if (request.getAssetId() != null) {
            Asset asset = assetRepository.findById(request.getAssetId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Asset not found with id: " + request.getAssetId()
                    ));
            task.setAsset(asset);
        }

        Task savedTask = taskRepository.save(task);

        saveActivityLog(
                savedTask,
                currentUser,
                "Task created",
                null,
                TaskStatus.REPORTED,
                "Task reported by user"
        );

        return mapToResponse(savedTask);
    }

    public List<TaskResponse> getAllTasks(String keyword, TaskStatus status, TaskPriority priority) {
        User currentUser = getCurrentUser();
        RoleName role = currentUser.getRole().getRoleName();

        String safeKeyword = (keyword == null) ? "" : keyword.trim();

        List<Task> tasks;

        switch (role) {
            case MANAGER,ADMIN -> {
                if (safeKeyword.isBlank() && status == null && priority == null) {
                    tasks = taskRepository.findAll();
                } else {
                    tasks = taskRepository.searchAndFilterAll(safeKeyword, status, priority);
                }
            }

            case TECHNICIAN -> {
                if (safeKeyword.isBlank() && status == null) {
                    tasks = taskRepository.findByAssignedTo(currentUser);
                } else {
                    tasks = taskRepository.searchAndFilterForTechnician(safeKeyword, status, currentUser);
                }
            }

            case USER -> {
                if (safeKeyword.isBlank() && status == null) {
                    tasks = taskRepository.findByReportedBy(currentUser);
                } else {
                    tasks = taskRepository.searchAndFilterForUser(safeKeyword, status, currentUser);
                }
            }

            default -> throw new RuntimeException("Unsupported role: " + role);
        }

        return tasks.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToResponse)
                .toList();

    }

    public TaskResponse getTaskById(Long id) {
        User currentUser = getCurrentUser();

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        RoleName role = currentUser.getRole().getRoleName();

        boolean allowed = switch (role) {
            case MANAGER,ADMIN -> true;
            case TECHNICIAN -> task.getAssignedTo() != null &&
                    task.getAssignedTo().getId().equals(currentUser.getId());
            case USER -> task.getReportedBy() != null &&
                    task.getReportedBy().getId().equals(currentUser.getId());
        };

        if (!allowed) {
            throw new AccessDeniedException("You are not allowed to view this task");
        }

        return mapToResponse(task);
    }

    public TaskResponse assignTask(Long taskId, AssignTaskRequest request) {

        User manager = getCurrentUser();

        if (manager.getRole().getRoleName() != RoleName.MANAGER) {
            throw new AccessDeniedException("Only MANAGER can assign tasks");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Task not found"
                ));

        ensureTaskNotClosed(task);

        if (task.getAssignedTo() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Task is already assigned"
            );
        }

        if (!List.of(TaskStatus.REPORTED, TaskStatus.UNDER_REVIEW).contains(task.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Task must be in REPORTED or UNDER_REVIEW state to be assigned"
            );
        }

        User technician = userRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Technician not found"
                ));

        if (technician.getRole().getRoleName() != RoleName.TECHNICIAN) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Assigned user must be a technician"
            );
        }

        TaskStatus oldStatus = task.getStatus();

        task.setAssignedTo(technician);
        task.setAssignedBy(manager);
        task.setStatus(TaskStatus.ASSIGNED);
        task.setUpdatedAt(LocalDateTime.now());

        Task updated = taskRepository.save(task);

        saveActivityLog(updated, manager, "Task assigned", oldStatus, TaskStatus.ASSIGNED, request.getRemarks());

        return mapToResponse(updated);
    }

    private void saveActivityLog(Task task,
                                 User performedBy,
                                 String action,
                                 TaskStatus oldStatus,
                                 TaskStatus newStatus,
                                 String remarks) {

        ActivityLog log = new ActivityLog();
        log.setTask(task);
        log.setPerformedBy(performedBy);
        log.setAction(action);
        log.setOldStatus(oldStatus != null ? oldStatus.name() : null);
        log.setNewStatus(newStatus != null ? newStatus.name() : null);
        log.setRemarks(remarks);
        log.setCreatedAt(LocalDateTime.now());

        activityLogRepository.save(log);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("No authenticated user found");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user not found in database: " + email));
    }

    private String generateTaskCode() {
        Random random = new Random();
        String taskCode;

        do {
            int number = 1000 + random.nextInt(9000);
            String suffix = randomAlphaNumeric(3);
            taskCode = "TSK-" + number + "-" + suffix;
        } while (taskRepository.existsByTaskCode(taskCode));

        return taskCode;
    }

    private String randomAlphaNumeric(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }

        return sb.toString();
    }

    private TaskResponse mapToResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTaskCode(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getPriority(),
                task.getStatus(),

                task.getAsset() != null ? task.getAsset().getId() : null,
                task.getAsset() != null ? task.getAsset().getAssetCode() : null,
                task.getAsset() != null ? task.getAsset().getName() : null,

                task.getReportedBy() != null ? task.getReportedBy().getEmail() : null,
                task.getAssignedTo() != null ? task.getAssignedTo().getEmail() : null,
                task.getAssignedBy() != null ? task.getAssignedBy().getEmail() : null,

                task.getCreatedAt(),
                task.getAssignedAt(),
                task.getStartedAt(),
                task.getCompletedAt(),
                task.getReviewedAt(),
                task.getConfirmedAt(),
                task.getUpdatedAt()
        );
    }

    @Transactional
    public TaskResponse startTask(Long taskId, TaskActionRequest request) {
        User technician = getCurrentUser();

        if (technician.getRole().getRoleName() != RoleName.TECHNICIAN) {
            throw new AccessDeniedException("Only TECHNICIAN can start tasks");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(technician.getId())) {
            throw new AccessDeniedException("This task is not assigned to you");
        }

        if (task.getStatus() != TaskStatus.ASSIGNED && task.getStatus() != TaskStatus.MATERIAL_APPROVED) {
            throw new RuntimeException("Task can only be started when status is ASSIGNED or MATERIAL_APPROVED");
        }

        TaskStatus oldStatus = task.getStatus();

        task.setStatus(TaskStatus.IN_PROGRESS);
        if (task.getStartedAt() == null) {
            task.setStartedAt(LocalDateTime.now());
        }
        task.setUpdatedAt(LocalDateTime.now());

        Task updatedTask = taskRepository.save(task);

        saveActivityLog(
                updatedTask,
                technician,
                "Task started",
                oldStatus,
                TaskStatus.IN_PROGRESS,
                request != null ? request.getRemarks() : null
        );

        return mapToResponse(updatedTask);
    }

    @Transactional
    public TaskResponse completeTask(Long taskId, TaskActionRequest request) {
        User technician = getCurrentUser();

        if (technician.getRole().getRoleName() != RoleName.TECHNICIAN) {
            throw new AccessDeniedException("Only TECHNICIAN can complete tasks");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(technician.getId())) {
            throw new AccessDeniedException("This task is not assigned to you");
        }

        if (task.getStatus() != TaskStatus.IN_PROGRESS && task.getStatus() != TaskStatus.MATERIAL_APPROVED) {
            throw new RuntimeException("Task can only be completed when status is IN_PROGRESS or MATERIAL_APPROVED");
        }

        if (!List.of(TaskStatus.IN_PROGRESS, TaskStatus.MATERIAL_APPROVED).contains(task.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Task must be IN_PROGRESS or MATERIAL_APPROVED to complete"
            );
        }


        TaskStatus oldStatus = task.getStatus();

        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        Task updatedTask = taskRepository.save(task);

        saveActivityLog(
                updatedTask,
                technician,
                "Task completed",
                oldStatus,
                TaskStatus.COMPLETED,
                request != null ? request.getRemarks() : null
        );

        return mapToResponse(updatedTask);
    }

    @Transactional
    public TaskResponse confirmTask(Long taskId, TaskActionRequest request) {
        User manager = getCurrentUser();

        if (manager.getRole().getRoleName() != RoleName.MANAGER) {
            throw new AccessDeniedException("Only MANAGER can confirm tasks");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (task.getStatus() != TaskStatus.COMPLETED) {
            throw new RuntimeException("Only COMPLETED tasks can be confirmed");
        }

        TaskStatus oldStatus = task.getStatus();

        task.setStatus(TaskStatus.CONFIRMED);
        task.setConfirmedBy(manager);
        task.setConfirmedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        Task updatedTask = taskRepository.save(task);

        saveActivityLog(
                updatedTask,
                manager,
                "Task confirmed",
                oldStatus,
                TaskStatus.CONFIRMED,
                request != null ? request.getRemarks() : null
        );

        return mapToResponse(updatedTask);
    }

    @Transactional(readOnly = true)
    public List<ActivityLogResponse> getTaskActivityLogs(Long taskId) {
        User currentUser = getCurrentUser();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (!canViewTask(currentUser, task)) {
            throw new AccessDeniedException("You are not allowed to view activity logs for this task");
        }

        return activityLogRepository.findByTaskOrderByCreatedAtAsc(task)
                .stream()
                .map(this::mapActivityLogToResponse)
                .toList();
    }

    private boolean canViewTask(User currentUser, Task task) {
        RoleName role = currentUser.getRole().getRoleName();

        return switch (role) {
            case MANAGER,ADMIN-> true;
            case TECHNICIAN -> task.getAssignedTo() != null &&
                    task.getAssignedTo().getId().equals(currentUser.getId());
            case USER -> task.getReportedBy() != null &&
                    task.getReportedBy().getId().equals(currentUser.getId());
        };
    }

    private ActivityLogResponse mapActivityLogToResponse(ActivityLog log) {
        return new ActivityLogResponse(
                log.getId(),
                log.getTask() != null ? log.getTask().getId() : null,
                log.getPerformedBy() != null ? log.getPerformedBy().getEmail() : null,
                log.getAction(),
                log.getOldStatus(),
                log.getNewStatus(),
                log.getRemarks(),
                log.getCreatedAt()
        );
    }

    public TaskResponse closeTask(Long taskId, TaskActionRequest request) {
        User manager = getCurrentUser();

        if (manager.getRole().getRoleName() != RoleName.MANAGER) {
            throw new AccessDeniedException("Only MANAGER can close tasks");
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Task not found with id: " + taskId
                ));

        if (task.getStatus() != TaskStatus.CONFIRMED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only CONFIRMED tasks can be closed"
            );
        }

        TaskStatus oldStatus = task.getStatus();

        task.setStatus(TaskStatus.CLOSED);
        task.setUpdatedAt(LocalDateTime.now());

        Task updatedTask = taskRepository.save(task);

        saveActivityLog(
                updatedTask,
                manager,
                "Task closed",
                oldStatus,
                TaskStatus.CLOSED,
                request != null ? request.getRemarks() : null
        );

        return mapToResponse(updatedTask);
    }

    private void ensureTaskNotClosed(Task task) {
        if (task.getStatus() == TaskStatus.CLOSED) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Task is already CLOSED and cannot be modified"
            );
        }
    }



}
