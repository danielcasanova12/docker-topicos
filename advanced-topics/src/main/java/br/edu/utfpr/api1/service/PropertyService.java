package br.edu.utfpr.api1.service;

import br.edu.utfpr.api1.model.Property;
import br.edu.utfpr.api1.repository.PropertyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public List<Property> findAll() {
        return propertyRepository.findAll();
    }

    public Property findById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + id));
    }

    public Property save(Property property) {
        return propertyRepository.save(property);
    }

    public Property update(Long id, Property propertyDetails) {
        Property property = findById(id);
        property.setName(propertyDetails.getName());
        return propertyRepository.save(property);
    }

    public void delete(Long id) {
        Property property = findById(id);
        propertyRepository.delete(property);
    }
}
