package com.siemens.asset_maintenance.repository;

import com.siemens.asset_maintenance.entity.Role;
import com.siemens.asset_maintenance.entity.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    // Find role by name — used when assigning role to new user
    Optional<Role> findByRoleName(RoleName roleName);

    // Check if role exists — used during DB seeding
    boolean existsByRoleName(RoleName roleName);
}