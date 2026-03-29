package com.serviceconnect.backend.payloads.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

public class BookingRequest {
  @NotNull
  private Long customerId;
  
  @NotNull
  private Long providerId;

  private String scheduledTime;
  private String address;
  private String description;
  private Double totalAmount;
  private Boolean usePoints = false;

  // Getters and Setters
  public Long getCustomerId() { return customerId; }
  public void setCustomerId(Long customerId) { this.customerId = customerId; }

  public Long getProviderId() { return providerId; }
  public void setProviderId(Long providerId) { this.providerId = providerId; }

  public String getScheduledTime() { return scheduledTime; }
  public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }

  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public Double getTotalAmount() { return totalAmount; }
  public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

  public Boolean getUsePoints() { return usePoints; }
  public void setUsePoints(Boolean usePoints) { this.usePoints = usePoints; }
}
