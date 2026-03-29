package com.serviceconnect.backend.controllers;

import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.serviceconnect.backend.models.*;
import com.serviceconnect.backend.repository.*;

@RestController
@RequestMapping("/api/bidding")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BiddingController {

    @Autowired
    private JobRequestRepository jobRequestRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private ServiceCategoryRepository categoryRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // Post a new Job Request (Customer)
    @PostMapping("/request")
    public ResponseEntity<?> postJobRequest(@RequestBody Map<String, Object> payload) {
        JobRequest jr = new JobRequest();
        jr.setCustomer(userRepository.findById(Long.valueOf(payload.get("customerId").toString())).orElse(null));
        jr.setCategory(categoryRepository.findById(Long.valueOf(payload.get("categoryId").toString())).orElse(null));
        jr.setDescription(payload.get("description").toString());
        jr.setAddress(payload.get("address").toString());
        jr.setBudget(Double.parseDouble(payload.get("budget").toString()));
        return ResponseEntity.ok(jobRequestRepository.save(jr));
    }

    // Get all active Job Requests (Providers)
    @GetMapping("/requests")
    public List<JobRequest> getActiveRequests() {
        return jobRequestRepository.findByCompletedFalse();
    }

    // Post a Bid (Provider)
    @PostMapping("/bid")
    public ResponseEntity<?> postBid(@RequestBody Map<String, Object> payload) {
        Long id = Long.valueOf(payload.get("providerId").toString());
        ServiceProvider provider = serviceProviderRepository.findById(id)
            .orElseGet(() -> serviceProviderRepository.findByUserId(id).orElse(null));

        if (provider == null) {
            return ResponseEntity.badRequest().body("Provider not found");
        }

        Bid bid = new Bid();
        bid.setJobRequest(jobRequestRepository.findById(Long.valueOf(payload.get("requestId").toString())).orElse(null));
        bid.setProvider(provider);
        bid.setAmount(Double.parseDouble(payload.get("amount").toString()));
        bid.setOfferMessage(payload.get("message").toString());
        return ResponseEntity.ok(bidRepository.save(bid));
    }

    // Get bids for a specific request (Customer)
    @GetMapping("/requests/{requestId}/bids")
    public List<Bid> getBidsForRequest(@PathVariable Long requestId) {
        return bidRepository.findByJobRequestId(requestId);
    }

    // New: Get job requests by customer (Customer Workspace)
    @GetMapping("/requests/customer/{customerId}")
    public List<JobRequest> getRequestsByCustomer(@PathVariable Long customerId) {
        return jobRequestRepository.findByCustomerId(customerId);
    }

    // New: Get bids by provider (Provider Workspace)
    @GetMapping("/bids/provider/{providerId}")
    public List<Bid> getBidsByProvider(@PathVariable Long providerId) {
        return bidRepository.findByProviderId(providerId);
    }

    // Accept a Bid (Customer) -> Creates a Booking
    @PostMapping("/bid/{bidId}/accept")
    public ResponseEntity<?> acceptBid(@PathVariable Long bidId) {
        Bid bid = bidRepository.findById(bidId).orElse(null);
        if (bid == null) return ResponseEntity.notFound().build();

        JobRequest jr = bid.getJobRequest();
        jr.setCompleted(true);
        jobRequestRepository.save(jr);

        bid.setAccepted(true);
        bidRepository.save(bid);

        // Convert to formal booking
        Booking booking = new Booking();
        booking.setCustomer(jr.getCustomer());
        booking.setProvider(bid.getProvider());
        booking.setAddress(jr.getAddress());
        booking.setDescription(jr.getDescription() + " (Bid Accepted: " + bid.getOfferMessage() + ")");
        booking.setBookingTime(LocalDateTime.now());
        booking.setScheduledTime(LocalDateTime.now().plusDays(1)); // Default tomorrow
        booking.setTotalAmount(bid.getAmount());
        booking.setStatus(EBookingStatus.ACCEPTED);

        return ResponseEntity.ok(bookingRepository.save(booking));
    }
}
