package com.serviceconnect.backend.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.serviceconnect.backend.models.*;
import com.serviceconnect.backend.repository.*;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AvailabilityController {

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @GetMapping("/{providerId}")
    public List<ProviderAvailability> getAvailability(@PathVariable Long providerId) {
        return availabilityRepository.findByProviderId(providerId);
    }

    @PostMapping("/{providerId}")
    public ResponseEntity<?> setAvailability(@PathVariable Long providerId, @RequestBody Map<String, Object> payload) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId).orElse(null);
        if (provider == null) return ResponseEntity.notFound().build();

        LocalDate date = LocalDate.parse(payload.get("date").toString());
        List<String> slots = (List<String>) payload.get("slots");

        List<ProviderAvailability> existing = availabilityRepository.findByProviderIdAndAvailableDate(providerId, date);
        ProviderAvailability availability;
        if (!existing.isEmpty()) {
            availability = existing.get(0);
        } else {
            availability = new ProviderAvailability();
            availability.setProvider(provider);
            availability.setAvailableDate(date);
        }
        availability.setTimeSlots(slots);
        
        return ResponseEntity.ok(availabilityRepository.save(availability));
    }
}
