package br.edu.utfpr.api1.service;

import br.edu.utfpr.api1.dto.OrchardDto;
import br.edu.utfpr.api1.model.Orchard;
import br.edu.utfpr.api1.model.Property;
import br.edu.utfpr.api1.repository.OrchardRepository;
import br.edu.utfpr.api1.repository.PropertyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrchardService {

    private final OrchardRepository orchardRepository;
    private final PropertyRepository propertyRepository;

    public List<Orchard> findAll() {
        return orchardRepository.findAll();
    }

    public Orchard findById(Long id) {
        return orchardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Orchard not found with ID: " + id));
    }
    public Orchard createOrchard(OrchardDto dto) {
        Orchard orchard = new Orchard();
        orchard.setLatitude(dto.getLatitude());
        orchard.setLongitude(dto.getLongitude());
        if (dto.getPropertyId() != null) {
            Property property = propertyRepository.findById(dto.getPropertyId())
                    .orElseThrow(() -> new RuntimeException("Property not found with id: " + dto.getPropertyId()));
            orchard.setProperty(property);
        }

        return orchardRepository.save(orchard);
    }

    public Orchard update(Long id, Orchard orchardDetails) {
        Orchard orchard = findById(id);
        orchard.setLatitude(orchardDetails.getLatitude());
        orchard.setLongitude(orchardDetails.getLongitude());
        return orchardRepository.save(orchard);
    }

    public void delete(Long id) {
        System.out.println(id);
        orchardRepository.deleteById(id);
    }
}