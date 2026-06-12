package com.siemens.asset_maintenance.repository;

import com.siemens.asset_maintenance.entity.Role;
import com.siemens.asset_maintenance.entity.enums.RoleName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class RoleRepositoryTest {

    @Autowired
    private RoleRepository roleRepository;

    @Test
    void findByRoleName_shouldReturnRole() {
        Role role = new Role();
        role.setRoleName(RoleName.MANAGER);
        roleRepository.save(role);

        Optional<Role> result = roleRepository.findByRoleName(RoleName.MANAGER);

        assertTrue(result.isPresent());
        assertEquals(RoleName.MANAGER, result.get().getRoleName());
    }

    @Test
    void findByRoleName_shouldReturnEmpty_whenMissing() {
        Optional<Role> result = roleRepository.findByRoleName(RoleName.ADMIN);
        assertTrue(result.isEmpty());
    }
}