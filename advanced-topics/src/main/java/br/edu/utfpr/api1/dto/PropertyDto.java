package br.edu.utfpr.api1.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PropertyDto {
    @NotBlank(message = "O nome é obrigatório")
    private String name;
}
