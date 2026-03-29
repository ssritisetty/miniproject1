package com.serviceconnect.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@NoArgsConstructor
public class Review {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "booking_id")
  private Booking booking;

  @ManyToOne
  @JoinColumn(name = "customer_id")
  private User customer;

  @ManyToOne
  @JoinColumn(name = "provider_id")
  private ServiceProvider provider;

  private Integer rating;
  private String comment;
  private LocalDateTime createdAt;



  public Review(Booking booking, User customer, ServiceProvider provider, Integer rating, String comment) {
    this.booking = booking;
    this.customer = customer;
    this.provider = provider;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = LocalDateTime.now();
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public Booking getBooking() { return booking; }
  public void setBooking(Booking booking) { this.booking = booking; }

  public User getCustomer() { return customer; }
  public void setCustomer(User customer) { this.customer = customer; }

  public ServiceProvider getProvider() { return provider; }
  public void setProvider(ServiceProvider provider) { this.provider = provider; }

  public Integer getRating() { return rating; }
  public void setRating(Integer rating) { this.rating = rating; }

  public String getComment() { return comment; }
  public void setComment(String comment) { this.comment = comment; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
