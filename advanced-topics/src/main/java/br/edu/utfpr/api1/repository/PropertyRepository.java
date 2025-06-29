package br.edu.utfpr.api1.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.utfpr.api1.model.Property;


public interface PropertyRepository extends JpaRepository<Property, Long> {

}
