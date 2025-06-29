package br.edu.utfpr.api1.controller;

import br.edu.utfpr.api1.dto.OrchardDto;
import br.edu.utfpr.api1.model.Orchard;
import br.edu.utfpr.api1.service.OrchardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orchards")
@CrossOrigin(
    origins = "*",
    allowedHeaders = "*",
    // libera todos os métodos HTTP
    methods = { 
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE,
        RequestMethod.OPTIONS 
    }
)
@RequiredArgsConstructor
@Tag(name = "Pomares", description = "Endpoints para gerenciamento de pomares")
public class OrchardController {

    private final OrchardService orchardService;

    @Operation(summary = "Buscar todos os pomares")
    @GetMapping
    public List<Orchard> getAll() {
        return orchardService.findAll();
    }

    @Operation(summary = "Buscar pomar por ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrchardById(@PathVariable Long id) {
        try {
            Orchard orchard = orchardService.findById(id);
            return ResponseEntity.ok(orchard);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @Operation(summary = "Criar pomar")
    @PostMapping
    public ResponseEntity<Orchard> create(@RequestBody @Valid OrchardDto orchard) {
        return ResponseEntity.ok(orchardService.createOrchard(orchard));
    }

    @Operation(summary = "Atualizar pomar")
    @PutMapping("/{id}")
    public ResponseEntity<Orchard> update(@PathVariable Long id, @RequestBody Orchard orchard) {
        return ResponseEntity.ok(orchardService.update(id, orchard));
    }

    @Operation(summary = "Deletar pomar")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            orchardService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
