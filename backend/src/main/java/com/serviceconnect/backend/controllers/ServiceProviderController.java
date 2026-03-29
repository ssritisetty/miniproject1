package com.serviceconnect.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.serviceconnect.backend.models.ServiceProvider;
import com.serviceconnect.backend.services.ServiceProviderService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/providers")
public class ServiceProviderController {

  @Autowired
  ServiceProviderService providerService;

  @GetMapping
  public ResponseEntity<?> getAllProviders() {
    return ResponseEntity.ok(providerService.getAllProviders());
  }

  @GetMapping("/category/{categoryId}")
  public ResponseEntity<?> getProvidersByCategory(@PathVariable Long categoryId) {
    return ResponseEntity.ok(providerService.getProvidersByCategory(categoryId));
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getProviderById(@PathVariable Long id) {
    ServiceProvider provider = providerService.getProviderById(id);
    if (provider != null) {
      return ResponseEntity.ok(provider);
    }
    return ResponseEntity.notFound().build();
  }
}
