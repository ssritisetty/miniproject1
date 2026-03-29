package com.serviceconnect.backend.controllers;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.serviceconnect.backend.models.Review;
import com.serviceconnect.backend.payloads.request.ReviewRequest;
import com.serviceconnect.backend.services.ReviewService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

  @Autowired
  ReviewService reviewService;

  @PostMapping
  @PreAuthorize("hasRole('CUSTOMER')")
  public ResponseEntity<?> createReview(@Valid @RequestBody ReviewRequest request) {
    try {
      Review review = reviewService.createReview(request);
      return ResponseEntity.ok(review);
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @GetMapping("/provider/{providerId}")
  public ResponseEntity<?> getProviderReviews(@PathVariable Long providerId) {
    return ResponseEntity.ok(reviewService.getProviderReviews(providerId));
  }

  @GetMapping("/customer/{customerId}")
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public ResponseEntity<?> getCustomerReviews(@PathVariable Long customerId) {
    return ResponseEntity.ok(reviewService.getCustomerReviews(customerId));
  }
}
