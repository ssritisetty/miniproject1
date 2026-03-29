package com.serviceconnect.backend.models;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "provider_availability")
public class ProviderAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private ServiceProvider provider;

    private LocalDate availableDate;
    
    @ElementCollection
    private List<String> timeSlots; // E.g., ["09:00", "10:00", "14:00"]

    public ProviderAvailability() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ServiceProvider getProvider() { return provider; }
    public void setProvider(ServiceProvider provider) { this.provider = provider; }
    public LocalDate getAvailableDate() { return availableDate; }
    public void setAvailableDate(LocalDate availableDate) { this.availableDate = availableDate; }
    public List<String> getTimeSlots() { return timeSlots; }
    public void setTimeSlots(List<String> timeSlots) { this.timeSlots = timeSlots; }
}
