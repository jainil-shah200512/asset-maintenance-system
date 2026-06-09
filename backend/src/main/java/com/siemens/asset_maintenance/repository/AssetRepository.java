package com.siemens.asset_maintenance.repository;

import com.siemens.asset_maintenance.entity.Asset;
import com.siemens.asset_maintenance.entity.enums.AssetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    // Find asset by unique code — used in task creation dropdown
    Optional<Asset> findByAssetCode(String assetCode);

    // Check if asset code already exists — used during asset creation
    boolean existsByAssetCode(String assetCode);

    // Find all assets by status — used for filtering
    List<Asset> findByStatus(AssetStatus status);

    // Search by name, code, or location — powers the search bar
    @Query("""
            SELECT a FROM Asset a
            WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(a.assetCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(a.location) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    List<Asset> searchAssets(@Param("keyword") String keyword);

    // Search + filter by status combined — manager asset list page
    @Query("""
            SELECT a FROM Asset a
            WHERE (:status IS NULL OR a.status = :status)
            AND (
                LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(a.assetCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
                OR LOWER(a.location) LIKE LOWER(CONCAT('%', :keyword, '%'))
            )
            """)
    List<Asset> searchAndFilter(
            @Param("keyword") String keyword,
            @Param("status") AssetStatus status
    );
}