package com.serviceconnect.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.serviceconnect.backend.models.ServiceCategory;
import com.serviceconnect.backend.services.ServiceCategoryService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/categories")
public class ServiceCategoryController {

  @Autowired
  ServiceCategoryService categoryService;

  @GetMapping
  public ResponseEntity<?> getAllCategories() {
    return ResponseEntity.ok(categoryService.getAllCategories());
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
    ServiceCategory category = categoryService.getCategoryById(id);
    if (category != null) {
      return ResponseEntity.ok(category);
    }
    return ResponseEntity.notFound().build();
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> createCategory(@RequestBody ServiceCategory category) {
    return ResponseEntity.ok(categoryService.createCategory(category));
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody ServiceCategory category) {
    try {
      return ResponseEntity.ok(categoryService.updateCategory(id, category));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
    try {
      categoryService.deleteCategory(id);
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Error deleting category");
    }
  }
}
