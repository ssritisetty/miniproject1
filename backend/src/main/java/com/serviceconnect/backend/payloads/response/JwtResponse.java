package com.serviceconnect.backend.payloads.response;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

public class JwtResponse {
  private String token;
  private String type = "Bearer";
  private Long id;
  private String username;
  private String email;
  private List<String> roles;
  private Long providerId;
  private Integer rewardPoints;

  public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles, Long providerId, Integer rewardPoints) {
    this.token = accessToken;
    this.id = id;
    this.username = username;
    this.email = email;
    this.roles = roles;
    this.providerId = providerId;
    this.rewardPoints = rewardPoints;
  }

  public String getToken() { return token; }
  public void setToken(String token) { this.token = token; }

  public String getTokenType() { return type; }
  public void setTokenType(String tokenType) { this.type = tokenType; }

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }

  public List<String> getRoles() { return roles; }
  public void setRoles(List<String> roles) { this.roles = roles; }

  public Long getProviderId() { return providerId; }
  public void setProviderId(Long providerId) { this.providerId = providerId; }

  public Integer getRewardPoints() { return rewardPoints; }
  public void setRewardPoints(Integer rewardPoints) { this.rewardPoints = rewardPoints; }
}
