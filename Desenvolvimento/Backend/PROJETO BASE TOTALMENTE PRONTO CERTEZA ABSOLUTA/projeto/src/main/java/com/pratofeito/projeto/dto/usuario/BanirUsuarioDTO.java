package com.pratofeito.projeto.dto.usuario;

import jakarta.validation.constraints.NotBlank;

public class BanirUsuarioDTO {
    @NotBlank(message = "Motivo é obrigatório")
    private String motivo;

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}