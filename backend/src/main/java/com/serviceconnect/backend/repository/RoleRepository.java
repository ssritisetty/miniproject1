package com.serviceconnect.backend.repository;

import com.serviceconnect.backend.models.ERole;
import com.serviceconnect.backend.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
  Optional<Role> findByName(ERole name);
}
