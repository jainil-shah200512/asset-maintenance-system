package com.siemens.asset_maintenance.service;

import com.siemens.asset_maintenance.dto.request.AssetRequest;
import com.siemens.asset_maintenance.dto.response.AssetResponse;
import com.siemens.asset_maintenance.entity.Asset;
import com.siemens.asset_maintenance.entity.enums.AssetStatus;
import com.siemens.asset_maintenance.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;

    public AssetResponse createAsset(AssetRequest request) {
        if (assetRepository.existsByAssetCode(request.getAssetCode())) {
            // RC: RuntimeException is caught by GlobalExceptionHandler as 400 Bad Request — should be ResponseStatusException(HttpStatus.CONFLICT) for 409
            throw new RuntimeException("Asset with code already exists: " + request.getAssetCode());
        }

        Asset asset = new Asset();
        asset.setAssetCode(request.getAssetCode());
        asset.setName(request.getName());
        asset.setLocation(request.getLocation());

        if (request.getStatus() != null) {
            asset.setStatus(request.getStatus());
        }

        Asset saved = assetRepository.save(asset);
        return mapToResponse(saved);
    }

    public List<AssetResponse> getAllAssets() {
        return assetRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AssetResponse getAssetById(Long id) {
        // RC: RuntimeException returns 400 Bad Request — should be ResponseStatusException(HttpStatus.NOT_FOUND) for 404
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));
        return mapToResponse(asset);
    }

    public AssetResponse getAssetByCode(String assetCode) {
        // RC: RuntimeException returns 400 Bad Request — should be ResponseStatusException(HttpStatus.NOT_FOUND) for 404
        Asset asset = assetRepository.findByAssetCode(assetCode)
                .orElseThrow(() -> new RuntimeException("Asset not found with code: " + assetCode));
        return mapToResponse(asset);
    }

    public List<AssetResponse> searchAssets(String keyword, AssetStatus status) {
        List<Asset> assets;

        String safeKeyword = (keyword == null) ? "" : keyword.trim();

        if (safeKeyword.isBlank()) {
            if (status == null) {
                assets = assetRepository.findAll();
            } else {
                assets = assetRepository.findByStatus(status);
            }
        } else {
            if (status == null) {
                assets = assetRepository.searchAssets(safeKeyword);
            } else {
                assets = assetRepository.searchAndFilter(safeKeyword, status);
            }
        }

        return assets.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AssetResponse updateAsset(Long id, AssetRequest request) {
        // RC: RuntimeException returns 400 Bad Request — should be ResponseStatusException(HttpStatus.NOT_FOUND) for 404
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));

        if (request.getAssetCode() != null && !request.getAssetCode().equals(asset.getAssetCode())) {
            if (assetRepository.existsByAssetCode(request.getAssetCode())) {
                // RC: RuntimeException returns 400 Bad Request — should be ResponseStatusException(HttpStatus.CONFLICT) for 409
                throw new RuntimeException("Another asset already uses code: " + request.getAssetCode());
            }
            asset.setAssetCode(request.getAssetCode());
        }

        if (request.getName() != null) {
            asset.setName(request.getName());
        }

        if (request.getLocation() != null) {
            asset.setLocation(request.getLocation());
        }

        if (request.getStatus() != null) {
            asset.setStatus(request.getStatus());
        }

        Asset updated = assetRepository.save(asset);
        return mapToResponse(updated);
    }

    public void deleteAsset(Long id) {
        // RC: RuntimeException returns 400 Bad Request — should be ResponseStatusException(HttpStatus.NOT_FOUND) for 404
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));

        assetRepository.delete(asset);
    }

    private AssetResponse mapToResponse(Asset asset) {
        return new AssetResponse(
                asset.getId(),
                asset.getAssetCode(),
                asset.getName(),
                asset.getLocation(),
                asset.getStatus(),
                asset.getCreatedAt()
        );
    }
}
