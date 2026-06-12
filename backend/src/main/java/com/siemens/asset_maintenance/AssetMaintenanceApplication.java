package com.siemens.asset_maintenance;
import com.siemens.asset_maintenance.entity.Role;
import com.siemens.asset_maintenance.entity.User;
import com.siemens.asset_maintenance.entity.enums.RoleName;
import com.siemens.asset_maintenance.repository.RoleRepository;
import com.siemens.asset_maintenance.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;


@SpringBootApplication  // ← Must NOT exclude security here
public class AssetMaintenanceApplication {
	public static void main(String[] args) {
		SpringApplication.run(AssetMaintenanceApplication.class, args);
	}


//	@Bean
//    CommandLineRunner seedManager(RoleRepository roleRepository,
//                                  UserRepository userRepository,
//                                  PasswordEncoder passwordEncoder) {
//		return args -> {
//
//			// ✅ STEP 1 — Get or create MANAGER role
//			Role managerRole = roleRepository
//					.findByRoleName(RoleName.MANAGER)
//					.orElseGet(() -> {
//						Role r = new Role();
//						r.setRoleName(RoleName.MANAGER);
//						return roleRepository.save(r);
//					});
//
//			// ✅ STEP 2 — Check if manager exists
//			if (userRepository.findByEmail("manager@siemens.com").isEmpty()) {
//
//				// ✅ STEP 3 — Create manager
//				User manager = new User();
//				manager.setFirstName("Manager");
//				manager.setLastName("User");
//				manager.setEmail("manager@siemens.com");
//
//				// 🔥 IMPORTANT — encrypt password
//				manager.setPasswordHash(passwordEncoder.encode("password123"));
//
//				manager.setRole(managerRole);
//				manager.setIsActive(true);
//
//				userRepository.save(manager);
//
//				System.out.println("✅ Manager user created: manager@siemens.com / password123");
//			}
//		};
//	}

	@Bean
	@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = true)
	CommandLineRunner seedUsers(RoleRepository roleRepository,
	                            UserRepository userRepository,
	                            PasswordEncoder passwordEncoder) {
		return args -> {

			Role userRole = roleRepository.findByRoleName(RoleName.USER)
					.orElseGet(() -> {
						Role r = new Role();
						r.setRoleName(RoleName.USER);
						return roleRepository.save(r);
					});

			Role managerRole = roleRepository.findByRoleName(RoleName.MANAGER)
					.orElseGet(() -> {
						Role r = new Role();
						r.setRoleName(RoleName.MANAGER);
						return roleRepository.save(r);
					});

			Role technicianRole = roleRepository.findByRoleName(RoleName.TECHNICIAN)
					.orElseGet(() -> {
						Role r = new Role();
						r.setRoleName(RoleName.TECHNICIAN);
						return roleRepository.save(r);
					});

			Role adminRole = roleRepository.findByRoleName(RoleName.ADMIN)
					.orElseGet(() -> {
						Role r = new Role();
						r.setRoleName(RoleName.ADMIN);
						return roleRepository.save(r);
					});

			if (userRepository.findByEmail("user@siemens.com").isEmpty()) {
				User user = new User();
				user.setFirstName("Test");
				user.setLastName("User");
				user.setEmail("user@siemens.com");
				user.setPasswordHash(passwordEncoder.encode("password123"));
				user.setRole(userRole);
				user.setIsActive(true);
				userRepository.save(user);

				System.out.println("✅ Seeded USER: user@siemens.com / password123");
			}

			if (userRepository.findByEmail("manager@siemens.com").isEmpty()) {
				User manager = new User();
				manager.setFirstName("Manager");
				manager.setLastName("User");
				manager.setEmail("manager@siemens.com");
				manager.setPasswordHash(passwordEncoder.encode("password123"));
				manager.setRole(managerRole);
				manager.setIsActive(true);
				userRepository.save(manager);

				System.out.println("✅ Seeded MANAGER: manager@siemens.com / password123");
			}

			if (userRepository.findByEmail("technician@siemens.com").isEmpty()) {
				User technician = new User();
				technician.setFirstName("Tech");
				technician.setLastName("User");
				technician.setEmail("technician@siemens.com");
				technician.setPasswordHash(passwordEncoder.encode("password123"));
				technician.setRole(technicianRole);
				technician.setIsActive(true);
				userRepository.save(technician);

				System.out.println("✅ Seeded TECHNICIAN: technician@siemens.com / password123");
			}

			if (userRepository.findByEmail("admin@siemens.com").isEmpty()) {
				User admin = new User();
				admin.setFirstName("System");
				admin.setLastName("Admin");
				admin.setEmail("admin@siemens.com");
				admin.setPasswordHash(passwordEncoder.encode("password123"));
				admin.setRole(adminRole);
				admin.setIsActive(true);
				userRepository.save(admin);

				System.out.println("✅ Seeded ADMIN: admin@siemens.com / password123");
			}
		};
	}

}