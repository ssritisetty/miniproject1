package com.serviceconnect.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.serviceconnect.backend.models.ServiceProvider;
import com.serviceconnect.backend.repository.ServiceProviderRepository;

@Service
public class ServiceProviderService {

  @Autowired
  ServiceProviderRepository providerRepository;

  public List<ServiceProvider> getAllProviders() {
    return providerRepository.findAllByOrderByRatingDesc();
  }

  public List<ServiceProvider> getProvidersByCategory(Long categoryId) {
    return providerRepository.findByCategoryIdOrderByRatingDesc(categoryId);
  }

  public ServiceProvider getProviderById(Long id) {
    return providerRepository.findById(id).orElse(null);
  }
}
