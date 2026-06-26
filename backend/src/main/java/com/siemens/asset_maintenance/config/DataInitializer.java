package com.siemens.asset_maintenance.config;

import com.siemens.asset_maintenance.entity.Asset;
import com.siemens.asset_maintenance.entity.Role;
import com.siemens.asset_maintenance.entity.User;
import com.siemens.asset_maintenance.repository.AssetRepository;
import com.siemens.asset_maintenance.repository.RoleRepository;
import com.siemens.asset_maintenance.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

/**
 * Initialize test data for CI/CD pipeline
 */
@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeTestData(
            RoleRepository roleRepository,
            UserRepository userRepository,
            AssetRepository assetRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Create roles if they don't exist
            if (roleRepository.count() == 0) {
                roleRepository.save(new Role("MANAGER"));
                roleRepository.save(new Role("TECHNICIAN"));
                roleRepository.save(new Role("USER"));
            }

            // Create test users if they don't exist
            if (userRepository.count() == 0) {
                Role managerRole = roleRepository.findByName("MANAGER");
                Role technicianRole = roleRepository.findByName("TECHNICIAN");
                Role userRole = roleRepository.findByName("USER");

                User manager = new User();
                manager.setEmail("manager@test.com");
                manager.setPassword(passwordEncoder.encode("Manager@1234"));
                manager.setRole(managerRole);
                manager.setCreatedAt(LocalDateTime.now());
                manager.setUpdatedAt(LocalDateTime.now());
                userRepository.save(manager);

                User technician = new User();
                technician.setEmail("technician@test.com");
                technician.setPassword(passwordEncoder.encode("Tech@1234"));
                technician.setRole(technicianRole);
                technician.setCreatedAt(LocalDateTime.now());
                technician.setUpdatedAt(LocalDateTime.now());
                userRepository.save(technician);

                User testUser = new User();
                testUser.setEmail("user@test.com");
                testUser.setPassword(passwordEncoder.encode("User@1234"));
                testUser.setRole(userRole);
                testUser.setCreatedAt(LocalDateTime.now());
                testUser.setUpdatedAt(LocalDateTime.now());
                userRepository.save(testUser);
            }

            // Create sample assets if they don't exist
            if (assetRepository.count() == 0) {
                Asset asset1 = new Asset();
                asset1.setCode("TST-001");
                asset1.setName("Alpha Equipment");
                asset1.setDescription("Test asset alpha");
                asset1.setStatus("OPERATIONAL");
                asset1.setCreatedBy(1L);
                asset1.setCreatedAt(LocalDateTime.now());
                asset1.setUpdatedAt(LocalDateTime.now());
                assetRepository.save(asset1);

                Asset asset2 = new Asset();
                asset2.setCode("TST-002");
                asset2.setName("Beta Equipment");
                asset2.setDescription("Test asset beta");
                asset2.setStatus("UNDER_MAINTENANCE");
                asset2.setCreatedBy(1L);
                asset2.setCreatedAt(LocalDateTime.now());
                asset2.setUpdatedAt(LocalDateTime.now());
                assetRepository.save(asset2);
            }
        };
    }
}
