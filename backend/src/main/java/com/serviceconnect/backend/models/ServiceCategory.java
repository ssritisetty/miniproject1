package com.serviceconnect.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "categories")
@NoArgsConstructor
public class ServiceCategory {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true)
  private String name;

  private String description;
  private String iconUrl;

  public ServiceCategory() {}

  public ServiceCategory(String name, String description) {
    this.name = name;
    this.description = description;
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getIconUrl() { return iconUrl; }
  public void setIconUrl(String iconUrl) { this.iconUrl = iconUrl; }
}
