package com.serviceconnect.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.serviceconnect.backend.models.Booking;
import com.serviceconnect.backend.models.Review;
import com.serviceconnect.backend.models.ServiceProvider;
import com.serviceconnect.backend.models.User;
import com.serviceconnect.backend.payloads.request.ReviewRequest;
import com.serviceconnect.backend.repository.BookingRepository;
import com.serviceconnect.backend.repository.ReviewRepository;
import com.serviceconnect.backend.repository.ServiceProviderRepository;
import com.serviceconnect.backend.repository.UserRepository;

@Service
public class ReviewService {
  @Autowired
  ReviewRepository reviewRepository;
  
  @Autowired
  UserRepository userRepository;
  
  @Autowired
  ServiceProviderRepository providerRepository;

  @Autowired
  BookingRepository bookingRepository;

  public Review createReview(ReviewRequest req) {
    if (reviewRepository.existsByBookingId(req.getBookingId())) {
      throw new RuntimeException("Review already exists for this booking");
    }

    Booking booking = bookingRepository.findById(req.getBookingId())
        .orElseThrow(() -> new RuntimeException("Booking not found"));
    User customer = userRepository.findById(req.getCustomerId())
        .orElseThrow(() -> new RuntimeException("Customer not found"));
    ServiceProvider provider = providerRepository.findById(req.getProviderId())
        .orElseThrow(() -> new RuntimeException("Provider not found"));
        
    Review review = new Review(booking, customer, provider, req.getRating(), req.getComment());
    Review savedReview = reviewRepository.save(review);
    
    // Update Provider Rating
    updateProviderRating(provider);
    
    return savedReview;
  }

  private void updateProviderRating(ServiceProvider provider) {
    List<Review> reviews = reviewRepository.findByProviderId(provider.getId());
    if (!reviews.isEmpty()) {
      double totalRating = 0;
      for (Review r : reviews) {
        totalRating += r.getRating();
      }
      provider.setRating(totalRating / reviews.size());
      provider.setTotalReviews(reviews.size());
      providerRepository.save(provider);
    }
  }

  public List<Review> getProviderReviews(Long providerId) {
    return reviewRepository.findByProviderId(providerId);
  }

  public List<Review> getCustomerReviews(Long customerId) {
    return reviewRepository.findByCustomerId(customerId);
  }
}
