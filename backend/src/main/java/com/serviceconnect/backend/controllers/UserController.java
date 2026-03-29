package com.serviceconnect.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.serviceconnect.backend.models.User;
import com.serviceconnect.backend.services.UserService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

  @Autowired
  private UserService userService;

  @GetMapping("/{id}")
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('PROVIDER') or hasRole('ADMIN')")
  public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
    return userService.getUserById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('PROVIDER') or hasRole('ADMIN')")
  public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody User userDetails) {
    try {
      User updatedUser = userService.updateUserProfile(id, userDetails);
      return ResponseEntity.ok(updatedUser);
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}
