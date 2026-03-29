package com.serviceconnect.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import com.serviceconnect.backend.repository.ServiceProviderRepository;

@Service
@EnableScheduling
public class GpsSimulatorService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final Map<Long, double[]> providerLocations = new HashMap<>();
    private final Random random = new Random();

    // Start with a base location (e.g., center of a city)
    private final double BASE_LAT = 12.9716;
    private final double BASE_LON = 77.5946;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Scheduled(fixedRate = 3000)
    public void broadcastLocations() {
        // Simulate movement for all registered providers
        serviceProviderRepository.findAll().forEach(provider -> {
            Long providerId = provider.getId();
            if (!providerLocations.containsKey(providerId)) {
                providerLocations.put(providerId, new double[]{BASE_LAT, BASE_LON});
            }

            double[] loc = providerLocations.get(providerId);
            loc[0] += (random.nextDouble() - 0.5) * 0.001; // Tiny lat movement
            loc[1] += (random.nextDouble() - 0.5) * 0.001; // Tiny lon movement

            Map<String, Double> payload = new HashMap<>();
            payload.put("lat", loc[0]);
            payload.put("lng", loc[1]);

            messagingTemplate.convertAndSend("/topic/gps/" + providerId, payload);
        });
    }
}
