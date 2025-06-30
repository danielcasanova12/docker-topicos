package br.edu.utfpr.api1.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "property")
@Getter
@Setter
public class Property extends BaseEntity {
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "property", fetch = jakarta.persistence.FetchType.EAGER)
    @JsonIgnore
    private List<Orchard> orchards;

    @OneToMany(mappedBy = "property", cascade = CascadeType.DETACH, orphanRemoval = true, fetch = jakarta.persistence.FetchType.EAGER)
    @JsonIgnore
    private List<Employee> employees;
}