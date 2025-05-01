package com.pratofeito.projeto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ComentarioDTO {
    @NotBlank
    private String texto;

    @NotNull
    private Integer usuarioId;

    @NotNull
    private Integer ocorrenciaId;

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Integer getOcorrenciaId() {
        return ocorrenciaId;
    }

    public void setOcorrenciaId(Integer ocorrenciaId) {
        this.ocorrenciaId = ocorrenciaId;
    }

}
