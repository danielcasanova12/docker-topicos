package br.edu.utfpr.api1.util;

import br.edu.utfpr.api1.model.Orchard;
import br.edu.utfpr.api1.model.Property;
import br.edu.utfpr.api1.repository.OrchardRepository;
import br.edu.utfpr.api1.repository.PropertyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    private final PropertyRepository propertyRepository;
    private final OrchardRepository orchardRepository;

    public DataLoader(PropertyRepository propertyRepository, OrchardRepository orchardRepository) {
        this.propertyRepository = propertyRepository;
        this.orchardRepository = orchardRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Verifica se já existem dados para evitar duplicação em reinícios
        if (propertyRepository.count() == 0) {
            Property property = new Property();
            property.setName("Fazenda Sol Nascente");
            property.setCreatedAt(LocalDateTime.now());
            property.setUpdatedAt(LocalDateTime.now());
            property = propertyRepository.save(property);

            Orchard orchard = new Orchard();
            orchard.setLatitude("-25.4284");
            orchard.setLongitude("-49.2733");
            orchard.setProperty(property);
            orchard.setCreatedAt(LocalDateTime.now());
            orchard.setUpdatedAt(LocalDateTime.now());
            orchardRepository.save(orchard);

            System.out.println("Dados iniciais inseridos: Fazenda Sol Nascente e um Pomar.");
        }
    }
}
