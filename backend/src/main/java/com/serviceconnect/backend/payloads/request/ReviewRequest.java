package com.serviceconnect.backend.payloads.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

public class ReviewRequest {
  @NotNull
  private Long bookingId;

  @NotNull
  private Long customerId;

  @NotNull
  private Long providerId;

  @NotNull
  @Min(1)
  @Max(5)
  private Integer rating;

  private String comment;

  // Getters and Setters
  public Long getBookingId() { return bookingId; }
  public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

  public Long getCustomerId() { return customerId; }
  public void setCustomerId(Long customerId) { this.customerId = customerId; }

  public Long getProviderId() { return providerId; }
  public void setProviderId(Long providerId) { this.providerId = providerId; }

  public Integer getRating() { return rating; }
  public void setRating(Integer rating) { this.rating = rating; }

  public String getComment() { return comment; }
  public void setComment(String comment) { this.comment = comment; }
}
