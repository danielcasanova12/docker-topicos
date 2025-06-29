package br.edu.utfpr.api1.controller;

import br.edu.utfpr.api1.model.Property;
import br.edu.utfpr.api1.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@Tag(name = "Propriedades", description = "Endpoints para gerenciamento de propriedades")
public class PropertyController {

    private final PropertyService propertyService;

    @Operation(summary = "Buscar todos as propriedades")
    @GetMapping
    public Iterable<Property> getAllProperties() {
        return propertyService.findAll();
    }

    @Operation(summary = "Buscar propriedade por ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getPropertyById(@PathVariable Long id) {
        try {
            Property property = propertyService.findById(id);
            return ResponseEntity.ok(property);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @Operation(summary = "Criar propriedade")
    @PostMapping
    public ResponseEntity<Property> createProperty(@RequestBody @Valid Property property) {
        Property savedProperty = propertyService.save(property);
        return ResponseEntity.ok(savedProperty);
    }

    @Operation(summary = "Atualizar propriedade")
    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id, @RequestBody Property property) {
        Property updatedProperty = propertyService.update(id, property);
        return ResponseEntity.ok(updatedProperty);
    }

    @Operation(summary = "Deletar propriedade")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        propertyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
