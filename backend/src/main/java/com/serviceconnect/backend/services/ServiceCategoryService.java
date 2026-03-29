package com.serviceconnect.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.serviceconnect.backend.models.ServiceCategory;
import com.serviceconnect.backend.repository.ServiceCategoryRepository;

@Service
public class ServiceCategoryService {
  @Autowired
  ServiceCategoryRepository categoryRepository;

  public List<ServiceCategory> getAllCategories() {
    return categoryRepository.findAll();
  }

  public ServiceCategory getCategoryById(Long id) {
    return categoryRepository.findById(id).orElse(null);
  }

  public ServiceCategory createCategory(ServiceCategory category) {
    return categoryRepository.save(category);
  }

  public ServiceCategory updateCategory(Long id, ServiceCategory updatedCategory) {
    return categoryRepository.findById(id).map(category -> {
      if (updatedCategory.getName() != null) category.setName(updatedCategory.getName());
      if (updatedCategory.getDescription() != null) category.setDescription(updatedCategory.getDescription());
      if (updatedCategory.getIconUrl() != null) category.setIconUrl(updatedCategory.getIconUrl());
      return categoryRepository.save(category);
    }).orElseThrow(() -> new RuntimeException("Category not found with id " + id));
  }

  public void deleteCategory(Long id) {
    categoryRepository.deleteById(id);
  }
}
