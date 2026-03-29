package com.serviceconnect.backend.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "bids")
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_request_id")
    @JsonIgnore
    private JobRequest jobRequest;

    @ManyToOne
    @JoinColumn(name = "provider_id")
    private ServiceProvider provider;

    private double amount;
    private String offerMessage;
    private LocalDateTime createdAt = LocalDateTime.now();
    private boolean accepted = false;

    public Bid() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public JobRequest getJobRequest() { return jobRequest; }
    public void setJobRequest(JobRequest jobRequest) { this.jobRequest = jobRequest; }
    public ServiceProvider getProvider() { return provider; }
    public void setProvider(ServiceProvider provider) { this.provider = provider; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public String getOfferMessage() { return offerMessage; }
    public void setOfferMessage(String offerMessage) { this.offerMessage = offerMessage; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public boolean isAccepted() { return accepted; }
    public void setAccepted(boolean accepted) { this.accepted = accepted; }
}
