package com.serviceconnect.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@NoArgsConstructor
public class Booking {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "customer_id")
  private User customer;

  @ManyToOne
  @JoinColumn(name = "provider_id")
  private ServiceProvider provider;

  private LocalDateTime bookingTime;
  private LocalDateTime scheduledTime;
  
  @Enumerated(EnumType.STRING)
  private EBookingStatus status = EBookingStatus.REQUESTED;

  private String address;
  private String description;
  private Double totalAmount;
  private Boolean isPaid = false;
  private Integer pointsUsed = 0;
  private String paymentMethod;
  private String emergencyReason;



  public Booking(User customer, ServiceProvider provider, LocalDateTime scheduledTime, String address, String description, Double totalAmount) {
    this.customer = customer;
    this.provider = provider;
    this.scheduledTime = scheduledTime;
    this.address = address;
    this.description = description;
    this.totalAmount = totalAmount;
    this.bookingTime = LocalDateTime.now();
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public User getCustomer() { return customer; }
  public void setCustomer(User customer) { this.customer = customer; }

  public ServiceProvider getProvider() { return provider; }
  public void setProvider(ServiceProvider provider) { this.provider = provider; }

  public LocalDateTime getBookingTime() { return bookingTime; }
  public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }

  public LocalDateTime getScheduledTime() { return scheduledTime; }
  public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }

  public EBookingStatus getStatus() { return status; }
  public void setStatus(EBookingStatus status) { this.status = status; }

  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public Double getTotalAmount() { return totalAmount; }
  public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

  public Boolean getIsPaid() { return isPaid; }
  public void setIsPaid(Boolean isPaid) { this.isPaid = isPaid; }

  public Integer getPointsUsed() { return pointsUsed; }
  public void setPointsUsed(Integer pointsUsed) { this.pointsUsed = pointsUsed; }

  public String getPaymentMethod() { return paymentMethod; }
  public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

  public String getEmergencyReason() { return emergencyReason; }
  public void setEmergencyReason(String emergencyReason) { this.emergencyReason = emergencyReason; }
}
