package com.serviceconnect.backend.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.serviceconnect.backend.models.Booking;
import com.serviceconnect.backend.models.EBookingStatus;
import com.serviceconnect.backend.models.ServiceProvider;
import com.serviceconnect.backend.models.User;
import com.serviceconnect.backend.payloads.request.BookingRequest;
import com.serviceconnect.backend.repository.BookingRepository;
import com.serviceconnect.backend.repository.ServiceProviderRepository;
import com.serviceconnect.backend.repository.UserRepository;

@Service
public class BookingService {
  @Autowired
  BookingRepository bookingRepository;
  
  @Autowired
  UserRepository userRepository;
  
  @Autowired
  ServiceProviderRepository providerRepository;

  public Booking createBooking(BookingRequest req) {
    User customer = userRepository.findById(req.getCustomerId())
        .orElseThrow(() -> new RuntimeException("Customer not found"));
    ServiceProvider provider = providerRepository.findById(req.getProviderId())
        .orElseThrow(() -> new RuntimeException("Provider not found"));
        
    double finalAmount = req.getTotalAmount();
    int pointsUsed = 0;

    if (req.getUsePoints() != null && req.getUsePoints() && customer.getRewardPoints() >= 50) {
      // 50 points = $5 discount
      int availablePoints = customer.getRewardPoints();
      int possibleDiscountPoints = (availablePoints / 50) * 50; 
      double discount = (possibleDiscountPoints / 50.0) * 5.0;
      
      if (discount > finalAmount) {
        discount = Math.floor(finalAmount); 
        possibleDiscountPoints = (int)(discount / 5.0) * 50;
      }
      
      finalAmount -= discount;
      pointsUsed = possibleDiscountPoints;
      
      customer.setRewardPoints(customer.getRewardPoints() - pointsUsed);
      userRepository.save(customer);
    }

    // Parse scheduledTime string (ISO-8601, may end in 'Z')
    LocalDateTime scheduledTime = null;
    if (req.getScheduledTime() != null && !req.getScheduledTime().isEmpty()) {
      try {
        // Remove trailing 'Z' or offset to parse as LocalDateTime
        String timeStr = req.getScheduledTime().replaceAll("Z$", "").replaceAll("\\+.*$", "");
        // Remove milliseconds if present beyond 3 digits
        if (timeStr.contains(".") && timeStr.substring(timeStr.indexOf(".")).length() > 4) {
          timeStr = timeStr.substring(0, timeStr.indexOf(".") + 4);
        }
        scheduledTime = LocalDateTime.parse(timeStr);
      } catch (Exception e) {
        scheduledTime = LocalDateTime.now().plusDays(1);
      }
    } else {
      scheduledTime = LocalDateTime.now().plusDays(1);
    }

    Booking booking = new Booking(customer, provider, scheduledTime,
        req.getAddress(), req.getDescription(), finalAmount);
    booking.setPointsUsed(pointsUsed);
    booking.setPaymentMethod(req.getPaymentMethod());
    booking.setEmergencyReason(req.getEmergencyReason());
    return bookingRepository.save(booking);
  }

  public List<Booking> getCustomerBookings(Long customerId) {
    return bookingRepository.findByCustomerId(customerId);
  }

  public List<Booking> getProviderBookings(Long providerId) {
    // Attempt to find as providerId directly first (new frontend logic)
    if (providerRepository.existsById(providerId)) {
        return bookingRepository.findByProviderId(providerId);
    }
    // Fallback for userId (legacy or other calls)
    return providerRepository.findByUserId(providerId)
        .map(p -> bookingRepository.findByProviderId(p.getId()))
        .orElse(List.of());
  }

  public Booking updateStatus(Long bookingId, EBookingStatus status) {
    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new RuntimeException("Booking not found"));
    EBookingStatus oldStatus = booking.getStatus();
    booking.setStatus(status);
    
    // Award points on completion
    if (status == EBookingStatus.COMPLETED && oldStatus != EBookingStatus.COMPLETED) {
      User customer = booking.getCustomer();
      customer.setRewardPoints(customer.getRewardPoints() + 50);
      userRepository.save(customer);
    }
    
    return bookingRepository.save(booking);
  }
}
