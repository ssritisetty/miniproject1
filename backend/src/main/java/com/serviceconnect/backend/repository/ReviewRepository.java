package com.serviceconnect.backend.repository;

import com.serviceconnect.backend.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
  List<Review> findByProviderId(Long providerId);
  List<Review> findByCustomerId(Long customerId);
  Boolean existsByBookingId(Long bookingId);
}
