package com.siemens.asset_maintenance.repository;

import com.siemens.asset_maintenance.entity.MaterialRequest;
import com.siemens.asset_maintenance.entity.Task;
import com.siemens.asset_maintenance.entity.User;
import com.siemens.asset_maintenance.entity.enums.MaterialRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialRequestRepository extends JpaRepository<MaterialRequest, Long> {

    // All material requests for a task — shown in task detail view
    List<MaterialRequest> findByTask(Task task);

    // All requests made by a specific technician
    List<MaterialRequest> findByRequestedBy(User requestedBy);

    // Requests for a task filtered by status — e.g. show only PENDING to manager
    List<MaterialRequest> findByTaskAndStatus(Task task, MaterialRequestStatus status);

    // Check if task has any PENDING requests
    // Used to set task status to PENDING_MATERIAL_APPROVAL
    boolean existsByTaskAndStatus(Task task, MaterialRequestStatus status);
}