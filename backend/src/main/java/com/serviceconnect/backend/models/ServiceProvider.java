package com.serviceconnect.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "service_providers")
@NoArgsConstructor
public class ServiceProvider {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne
  @JoinColumn(name = "category_id")
  private ServiceCategory category;

  private String bio;
  private String experience;
  private Double hourlyRate;
  private Double rating = 0.0;
  private Integer totalReviews = 0;
  private Boolean isVerified = false;
  private Boolean isAvailable = true;



  public ServiceProvider(User user, ServiceCategory category, String bio, String experience, Double hourlyRate) {
    this.user = user;
    this.category = category;
    this.bio = bio;
    this.experience = experience;
    this.hourlyRate = hourlyRate;
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }

  public ServiceCategory getCategory() { return category; }
  public void setCategory(ServiceCategory category) { this.category = category; }

  public String getBio() { return bio; }
  public void setBio(String bio) { this.bio = bio; }

  public String getExperience() { return experience; }
  public void setExperience(String experience) { this.experience = experience; }

  public Double getHourlyRate() { return hourlyRate; }
  public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }

  public Double getRating() { return rating; }
  public void setRating(Double rating) { this.rating = rating; }

  public Integer getTotalReviews() { return totalReviews; }
  public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

  public Boolean getIsVerified() { return isVerified; }
  public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

  public Boolean getIsAvailable() { return isAvailable; }
  public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}
