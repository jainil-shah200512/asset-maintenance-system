package com.siemens.asset_maintenance.repository;

import com.siemens.asset_maintenance.entity.ActivityLog;
import com.siemens.asset_maintenance.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    // Get logs ordered by time — powers the Activity Log in task detail view
    List<ActivityLog> findByTaskOrderByCreatedAtAsc(Task task);

    // Get all logs for a task (no order) — for general use
    List<ActivityLog> findByTask(Task task);
}