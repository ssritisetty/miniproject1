package com.serviceconnect.backend.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.serviceconnect.backend.models.ERole;
import com.serviceconnect.backend.models.Role;
import com.serviceconnect.backend.models.User;
import com.serviceconnect.backend.models.ServiceProvider;
import com.serviceconnect.backend.models.ServiceCategory;
import com.serviceconnect.backend.payloads.request.LoginRequest;
import com.serviceconnect.backend.payloads.request.SignupRequest;
import com.serviceconnect.backend.payloads.response.JwtResponse;
import com.serviceconnect.backend.payloads.response.MessageResponse;
import com.serviceconnect.backend.repository.RoleRepository;
import com.serviceconnect.backend.repository.UserRepository;
import com.serviceconnect.backend.repository.ServiceProviderRepository;
import com.serviceconnect.backend.repository.ServiceCategoryRepository;
import com.serviceconnect.backend.security.jwt.JwtUtils;
import com.serviceconnect.backend.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  ServiceProviderRepository serviceProviderRepository;

  @Autowired
  ServiceCategoryRepository serviceCategoryRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @GetMapping("/test")
  public String test() {
    return "Hello, World!";
  }

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    Long providerId = null;
    if (roles.contains("ROLE_PROVIDER")) {
        providerId = serviceProviderRepository.findByUserId(userDetails.getId())
            .map(ServiceProvider::getId)
            .orElse(null);
    }

    User user = userRepository.findById(userDetails.getId()).orElse(null);
    Integer rewardPoints = (user != null) ? user.getRewardPoints() : 0;

    return ResponseEntity.ok(new JwtResponse(jwt, 
                         userDetails.getId(), 
                         userDetails.getUsername(), 
                         userDetails.getEmail(), 
                         roles,
                         providerId,
                         rewardPoints));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(), 
               signUpRequest.getEmail(),
               encoder.encode(signUpRequest.getPassword()));
    user.setPhoneNumber(signUpRequest.getPhoneNumber());

    Set<String> strRoles = signUpRequest.getRoles();
    Set<Role> roles = new HashSet<>();
    final boolean[] isProvider = new boolean[1];

    if (strRoles == null) {
      Role userRole = roleRepository.findByName(ERole.ROLE_CUSTOMER)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {
        switch (role) {
        case "admin":
          Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(adminRole);
          break;
        case "provider":
          Role providerRole = roleRepository.findByName(ERole.ROLE_PROVIDER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(providerRole);
          isProvider[0] = true;
          break;
        default:
          Role userRole = roleRepository.findByName(ERole.ROLE_CUSTOMER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(userRole);
        }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    if (isProvider[0]) {
      if (signUpRequest.getCategoryId() == null) {
        return ResponseEntity.badRequest().body(new MessageResponse("Error: Category ID is required for providers!"));
      }
      ServiceCategory category = serviceCategoryRepository.findById(signUpRequest.getCategoryId())
          .orElse(null);
      if (category == null) {
        return ResponseEntity.badRequest().body(new MessageResponse("Error: Selected category not found!"));
      }
      ServiceProvider provider = new ServiceProvider(user, category, "", "", 0.0);
      serviceProviderRepository.save(provider);
    }

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }
}
