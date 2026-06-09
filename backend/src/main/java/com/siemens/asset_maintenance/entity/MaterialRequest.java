package com.siemens.asset_maintenance.entity;

import com.siemens.asset_maintenance.entity.enums.MaterialRequestStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "material_requests")
public class MaterialRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(name = "material_description", columnDefinition = "TEXT", nullable = false)
    private String materialDescription;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "approved_quantity")
    private Integer approvedQuantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MaterialRequestStatus status = MaterialRequestStatus.PENDING;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}