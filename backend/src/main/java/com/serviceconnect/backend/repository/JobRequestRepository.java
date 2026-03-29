package com.serviceconnect.backend.repository;

import java.util.List;
import com.serviceconnect.backend.models.JobRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRequestRepository extends JpaRepository<JobRequest, Long> {
    List<JobRequest> findByCompletedFalse();
    List<JobRequest> findByCustomerId(Long customerId);
}
