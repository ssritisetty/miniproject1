package com.serviceconnect.backend.models;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "job_requests")
public class JobRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private ServiceCategory category;

    private String description;
    private String address;
    private double budget;
    private LocalDateTime createdAt = LocalDateTime.now();
    private boolean completed = false;

    @OneToMany(mappedBy = "jobRequest")
    private List<Bid> bids;

    public JobRequest() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    public ServiceCategory getCategory() { return category; }
    public void setCategory(ServiceCategory category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public double getBudget() { return budget; }
    public void setBudget(double budget) { this.budget = budget; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public List<Bid> getBids() { return bids; }
    public void setBids(List<Bid> bids) { this.bids = bids; }
}
