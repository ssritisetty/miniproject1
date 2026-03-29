package com.serviceconnect.backend.repository;

import com.serviceconnect.backend.models.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import java.util.Optional;

@Repository
public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
  List<ServiceProvider> findByCategoryIdOrderByRatingDesc(Long categoryId);
  List<ServiceProvider> findAllByOrderByRatingDesc();
  Optional<ServiceProvider> findByUserId(Long userId);
}
