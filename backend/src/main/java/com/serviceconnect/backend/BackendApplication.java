package com.serviceconnect.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@org.springframework.context.annotation.Bean
	org.springframework.boot.CommandLineRunner init(
			com.serviceconnect.backend.repository.RoleRepository roleRepository,
			com.serviceconnect.backend.repository.ServiceCategoryRepository categoryRepository) {
		return args -> {
			// Init Roles
			if (roleRepository.findByName(com.serviceconnect.backend.models.ERole.ROLE_CUSTOMER).isEmpty()) {
				roleRepository.save(new com.serviceconnect.backend.models.Role(com.serviceconnect.backend.models.ERole.ROLE_CUSTOMER));
			}
			if (roleRepository.findByName(com.serviceconnect.backend.models.ERole.ROLE_PROVIDER).isEmpty()) {
				roleRepository.save(new com.serviceconnect.backend.models.Role(com.serviceconnect.backend.models.ERole.ROLE_PROVIDER));
			}
			if (roleRepository.findByName(com.serviceconnect.backend.models.ERole.ROLE_ADMIN).isEmpty()) {
				roleRepository.save(new com.serviceconnect.backend.models.Role(com.serviceconnect.backend.models.ERole.ROLE_ADMIN));
			}

			// Init Categories
			if (categoryRepository.count() == 0) {
				categoryRepository.save(new com.serviceconnect.backend.models.ServiceCategory("Plumbing", "Everything related to pipes and water."));
				categoryRepository.save(new com.serviceconnect.backend.models.ServiceCategory("Cleaning", "Home and office cleaning services."));
				categoryRepository.save(new com.serviceconnect.backend.models.ServiceCategory("Electrical", "Repairs and installation of electrical systems."));
				categoryRepository.save(new com.serviceconnect.backend.models.ServiceCategory("Carpentry", "Woodwork and furniture assembly."));
				categoryRepository.save(new com.serviceconnect.backend.models.ServiceCategory("Landscaping", "Gardening and lawn maintenance."));
			}
		};
	}
}
