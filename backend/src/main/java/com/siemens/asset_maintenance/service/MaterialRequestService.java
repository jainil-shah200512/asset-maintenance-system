package com.siemens.asset_maintenance.service;

import com.siemens.asset_maintenance.dto.request.ApproveMaterialRequestDto;
import com.siemens.asset_maintenance.dto.request.CreateMaterialRequestDto;
import com.siemens.asset_maintenance.dto.request.RejectMaterialRequestDto;
import com.siemens.asset_maintenance.dto.response.MaterialRequestResponse;
import com.siemens.asset_maintenance.entity.ActivityLog;
import com.siemens.asset_maintenance.entity.MaterialRequest;
import com.siemens.asset_maintenance.entity.Task;
import com.siemens.asset_maintenance.entity.User;
import com.siemens.asset_maintenance.entity.enums.MaterialRequestStatus;
import com.siemens.asset_maintenance.entity.enums.RoleName;
import com.siemens.asset_maintenance.entity.enums.TaskStatus;
import com.siemens.asset_maintenance.repository.ActivityLogRepository;
import com.siemens.asset_maintenance.repository.MaterialRequestRepository;
import com.siemens.asset_maintenance.repository.TaskRepository;
import com.siemens.asset_maintenance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialRequestService {

    private final MaterialRequestRepository materialRequestRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;


    @Transactional
    public MaterialRequestResponse createMaterialRequest(CreateMaterialRequestDto request) {
        User technician = getCurrentUser();

        if (technician.getRole().getRoleName() != RoleName.TECHNICIAN) {
            throw new AccessDeniedException("Only TECHNICIAN can request materials");
        }

        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + request.getTaskId()));

        if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(technician.getId())) {
            throw new AccessDeniedException("You can request materials only for tasks assigned to you");
        }

        MaterialRequest materialRequest = new MaterialRequest();
        materialRequest.setTask(task);
        materialRequest.setRequestedBy(technician);
        materialRequest.setMaterialDescription(request.getMaterialDescription());
        materialRequest.setQuantity(request.getQuantity());
        materialRequest.setStatus(MaterialRequestStatus.PENDING);
        materialRequest.setCreatedAt(LocalDateTime.now());

        MaterialRequest savedRequest = materialRequestRepository.save(materialRequest);

        TaskStatus oldStatus = task.getStatus();
        task.setStatus(TaskStatus.PENDING_MATERIAL_APPROVAL);
        task.setUpdatedAt(LocalDateTime.now());
        taskRepository.save(task);

        saveActivityLog(
                task,
                technician,
                "Material request created",
                oldStatus,
                TaskStatus.PENDING_MATERIAL_APPROVAL,
                "Requested material: " + request.getMaterialDescription()
        );

        return mapToResponse(savedRequest);
    }

    public List<MaterialRequestResponse> getRequestsForTask(Long taskId) {
        User currentUser = getCurrentUser();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        RoleName role = currentUser.getRole().getRoleName();

        boolean allowed = switch (role) {
            case MANAGER,ADMIN -> true;
            case TECHNICIAN -> task.getAssignedTo() != null && task.getAssignedTo().getId().equals(currentUser.getId());
            case USER -> task.getReportedBy() != null && task.getReportedBy().getId().equals(currentUser.getId());
        };

        if (!allowed) {
            throw new AccessDeniedException("You are not allowed to view material requests for this task");
        }

        return materialRequestRepository.findByTask(task)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public MaterialRequestResponse approveRequest(Long requestId, ApproveMaterialRequestDto request) {
        User manager = getCurrentUser();

        if (manager.getRole().getRoleName() != RoleName.MANAGER) {
            throw new AccessDeniedException("Only MANAGER can approve material requests");
        }

        MaterialRequest materialRequest = materialRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Material request not found with id: " + requestId));

        Task task = materialRequest.getTask();

        if (materialRequest.getStatus() != MaterialRequestStatus.PENDING) {
            throw new RuntimeException("Only PENDING requests can be approved");
        }

        int approvedQty = (request.getApprovedQuantity() == null)
                ? materialRequest.getQuantity()
                : request.getApprovedQuantity();

        if (approvedQty <= 0 || approvedQty > materialRequest.getQuantity()) {
            throw new RuntimeException("Approved quantity must be between 1 and requested quantity");
        }

        materialRequest.setReviewedBy(manager);
        materialRequest.setApprovedQuantity(approvedQty);
        materialRequest.setApprovedAt(LocalDateTime.now());

        if (approvedQty == materialRequest.getQuantity()) {
            materialRequest.setStatus(MaterialRequestStatus.APPROVED);
        } else {
            materialRequest.setStatus(MaterialRequestStatus.PARTIALLY_APPROVED);
        }

        MaterialRequest savedRequest = materialRequestRepository.save(materialRequest);

        boolean stillPending = materialRequestRepository.existsByTaskAndStatus(task, MaterialRequestStatus.PENDING);

        TaskStatus oldStatus = task.getStatus();

        if (!stillPending) {
            task.setStatus(TaskStatus.MATERIAL_APPROVED);
            task.setUpdatedAt(LocalDateTime.now());
            taskRepository.save(task);

            saveActivityLog(
                    task,
                    manager,
                    "Material request approved",
                    oldStatus,
                    TaskStatus.MATERIAL_APPROVED,
                    request.getRemarks()
            );
        }

        return mapToResponse(savedRequest);
    }

    @Transactional
    public MaterialRequestResponse rejectRequest(Long requestId, RejectMaterialRequestDto request) {
        User manager = getCurrentUser();

        if (manager.getRole().getRoleName() != RoleName.MANAGER) {
            throw new AccessDeniedException("Only MANAGER can reject material requests");
        }

        MaterialRequest materialRequest = materialRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Material request not found with id: " + requestId));

        Task task = materialRequest.getTask();

        if (materialRequest.getStatus() != MaterialRequestStatus.PENDING) {
            throw new RuntimeException("Only PENDING requests can be rejected");
        }

        materialRequest.setReviewedBy(manager);
        materialRequest.setStatus(MaterialRequestStatus.REJECTED);
        materialRequest.setRejectionReason(request.getRejectionReason());

        MaterialRequest savedRequest = materialRequestRepository.save(materialRequest);

        boolean stillPending = materialRequestRepository.existsByTaskAndStatus(task, MaterialRequestStatus.PENDING);

        TaskStatus oldStatus = task.getStatus();

        if (!stillPending) {
            task.setStatus(TaskStatus.MATERIAL_REJECTED);
            task.setUpdatedAt(LocalDateTime.now());
            taskRepository.save(task);

            saveActivityLog(
                    task,
                    manager,
                    "Material request rejected",
                    oldStatus,
                    TaskStatus.MATERIAL_REJECTED,
                    request.getRejectionReason()
            );
        }

        return mapToResponse(savedRequest);
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

    private MaterialRequestResponse mapToResponse(MaterialRequest materialRequest) {
        return new MaterialRequestResponse(
                materialRequest.getId(),
                materialRequest.getTask() != null ? materialRequest.getTask().getId() : null,
                materialRequest.getTask() != null ? materialRequest.getTask().getTaskCode() : null,
                materialRequest.getRequestedBy() != null ? materialRequest.getRequestedBy().getEmail() : null,
                materialRequest.getReviewedBy() != null ? materialRequest.getReviewedBy().getEmail() : null,
                materialRequest.getMaterialDescription(),
                materialRequest.getQuantity(),
                materialRequest.getApprovedQuantity(),
                materialRequest.getStatus(),
                materialRequest.getRejectionReason(),
                materialRequest.getCreatedAt(),
                materialRequest.getApprovedAt()
        );
    }
}