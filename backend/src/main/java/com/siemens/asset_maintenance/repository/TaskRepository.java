package com.siemens.asset_maintenance.repository;

import com.siemens.asset_maintenance.entity.Task;
import com.siemens.asset_maintenance.entity.User;
import com.siemens.asset_maintenance.entity.enums.TaskPriority;
import com.siemens.asset_maintenance.entity.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Find task by auto-generated code — e.g. TSK-1234-XYZ
    Optional<Task> findByTaskCode(String taskCode);

    // Safety check during task code generation
    boolean existsByTaskCode(String taskCode);

    // ── USER: only sees tasks they reported ──────────────────────────────────
    List<Task> findByReportedBy(User reportedBy);

    // ── TECHNICIAN: only sees tasks assigned to them ──────────────────────────
    List<Task> findByAssignedTo(User assignedTo);

    // ── Dashboard summary counts ──────────────────────────────────────────────

    // Count all tasks by status — manager dashboard cards
    long countByStatus(TaskStatus status);

    // Count tasks assigned to technician by status — technician dashboard cards
    long countByAssignedToAndStatus(User assignedTo, TaskStatus status);

    // Count tasks reported by user — user dashboard card
    long countByReportedBy(User reportedBy);

    // ── Search + Filter queries ───────────────────────────────────────────────

    // MANAGER — search across all tasks
    @Query("""
            SELECT t FROM Task t
            WHERE (:status IS NULL OR t.status = :status)
            AND (:priority IS NULL OR t.priority = :priority)
            AND (
                LOWER(t.taskCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            """)
    List<Task> searchAndFilterAll(
            @Param("keyword") String keyword,
            @Param("status") TaskStatus status,
            @Param("priority") TaskPriority priority
    );

    // TECHNICIAN — search only their assigned tasks
    @Query("""
            SELECT t FROM Task t
            WHERE t.assignedTo = :user
            AND (:status IS NULL OR t.status = :status)
            AND (
                LOWER(t.taskCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            """)
    List<Task> searchAndFilterForTechnician(
            @Param("keyword") String keyword,
            @Param("status") TaskStatus status,
            @Param("user") User user
    );

    // USER — search only their reported tasks
    @Query("""
            SELECT t FROM Task t
            WHERE t.reportedBy = :user
            AND (:status IS NULL OR t.status = :status)
            AND (
                LOWER(t.taskCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            """)
    List<Task> searchAndFilterForUser(
            @Param("keyword") String keyword,
            @Param("status") TaskStatus status,
            @Param("user") User user
    );
}