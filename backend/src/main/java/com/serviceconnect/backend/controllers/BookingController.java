package com.serviceconnect.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.serviceconnect.backend.models.Booking;
import com.serviceconnect.backend.models.EBookingStatus;
import com.serviceconnect.backend.payloads.request.BookingRequest;
import com.serviceconnect.backend.services.BookingService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

  @Autowired
  BookingService bookingService;

  @PostMapping
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
    try {
      Booking booking = bookingService.createBooking(request);
      return ResponseEntity.ok(booking);
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @GetMapping("/customer/{customerId}")
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public ResponseEntity<?> getCustomerBookings(@PathVariable Long customerId) {
    return ResponseEntity.ok(bookingService.getCustomerBookings(customerId));
  }

  @GetMapping("/provider/{providerId}")
  @PreAuthorize("hasRole('PROVIDER') or hasRole('ADMIN')")
  public ResponseEntity<?> getProviderBookings(@PathVariable Long providerId) {
    return ResponseEntity.ok(bookingService.getProviderBookings(providerId));
  }

  @PutMapping("/{id}/status")
  @PreAuthorize("hasRole('PROVIDER') or hasRole('ADMIN') or hasRole('CUSTOMER')")
  public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam EBookingStatus status) {
    try {
      return ResponseEntity.ok(bookingService.updateStatus(id, status));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}
