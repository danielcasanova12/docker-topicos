package br.edu.utfpr.api1.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrchardDto {
    @NotBlank(message = "Latitude é obrigatória")
    private String latitude;

    @NotBlank(message = "Longitude é obrigatório")
    private String longitude;

    @NotNull(message = "ID da propriedade é obrigatório")
    private Long propertyId;
}
