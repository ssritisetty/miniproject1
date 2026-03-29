package com.serviceconnect.backend.repository;

import java.time.LocalDate;
import java.util.List;
import com.serviceconnect.backend.models.ProviderAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvailabilityRepository extends JpaRepository<ProviderAvailability, Long> {
    List<ProviderAvailability> findByProviderId(Long providerId);
    List<ProviderAvailability> findByProviderIdAndAvailableDate(Long providerId, LocalDate date);
}
