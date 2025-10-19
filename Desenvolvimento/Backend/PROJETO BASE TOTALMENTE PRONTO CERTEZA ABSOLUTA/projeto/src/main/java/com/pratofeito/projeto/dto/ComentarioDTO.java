package com.pratofeito.projeto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ComentarioDTO {
    @NotBlank
    private String texto;

    @NotNull
    private Long usuarioId;

    @NotNull
    private int usuarioAlvoId;

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public int getUsuarioAlvoId() {
        return usuarioAlvoId;
    }

    public void setUsuarioAlvoId(int usuarioAlvoId) {
        this.usuarioAlvoId = usuarioAlvoId;
    }
}
