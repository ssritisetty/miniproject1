package com.serviceconnect.backend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
    })
@NoArgsConstructor
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Size(max = 20)
  private String username;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  @NotBlank
  @Size(max = 120)
  private String password;

  private String fullName;
  private String phoneNumber;
  private String address;
  private String city;
  private Integer rewardPoints = 0;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "user_roles",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<Role> roles = new HashSet<>();

  public User() {}

  public User(String username, String email, String password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }

  public String getFullName() { return fullName; }
  public void setFullName(String fullName) { this.fullName = fullName; }

  public String getPhoneNumber() { return phoneNumber; }
  public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }

  public String getCity() { return city; }
  public void setCity(String city) { this.city = city; }

  public Integer getRewardPoints() { return rewardPoints; }
  public void setRewardPoints(Integer rewardPoints) { this.rewardPoints = rewardPoints; }

  public Set<Role> getRoles() { return roles; }
  public void setRoles(Set<Role> roles) { this.roles = roles; }
}
