package br.edu.utfpr.api1.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "report")
@Getter
@Setter
public class Report extends BaseEntity {

    @Column(name = "generated_at", nullable = false)
    private String generatedAt;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;
}
