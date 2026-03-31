package com.serviceconnect.backend.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.serviceconnect.backend.models.User;
import com.serviceconnect.backend.repository.UserRepository;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  public Optional<User> getUserById(Long id) {
    return userRepository.findById(id);
  }

  public Optional<User> getUserByUsername(String username) {
    return userRepository.findByUsername(username);
  }

  public User updateUserProfile(Long id, User updatedUser) {
    return userRepository.findById(id).map(user -> {
      if (updatedUser.getFullName() != null) user.setFullName(updatedUser.getFullName());
      if (updatedUser.getPhoneNumber() != null) user.setPhoneNumber(updatedUser.getPhoneNumber());
      if (updatedUser.getAddress() != null) user.setAddress(updatedUser.getAddress());
      if (updatedUser.getCity() != null) user.setCity(updatedUser.getCity());
      return userRepository.save(user);
    }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
  }

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Transactional
  public void deleteUser(Long id, String password) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found with id " + id));
    
    if (!passwordEncoder.matches(password, user.getPassword())) {
      throw new RuntimeException("Error: Invalid password verification!");
    }
    
    userRepository.delete(user);
  }
}
