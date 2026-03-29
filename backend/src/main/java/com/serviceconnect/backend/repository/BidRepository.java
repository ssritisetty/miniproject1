package com.serviceconnect.backend.repository;

import java.util.List;
import com.serviceconnect.backend.models.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByJobRequestId(Long jobRequestId);
    List<Bid> findByProviderId(Long providerId);
}
