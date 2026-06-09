package com.siemens.asset_maintenance.entity;

import com.siemens.asset_maintenance.entity.enums.AssetStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "asset_code", unique = true, nullable = false)
    private String assetCode;

    @Column(name = "name", nullable = false)
    private String name;

//    @Column(name = "location")
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AssetStatus status = AssetStatus.OPERATIONAL;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}