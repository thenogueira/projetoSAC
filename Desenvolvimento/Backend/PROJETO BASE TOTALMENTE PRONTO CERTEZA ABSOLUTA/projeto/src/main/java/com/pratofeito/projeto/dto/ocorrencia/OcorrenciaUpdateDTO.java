package com.pratofeito.projeto.dto.ocorrencia;

import com.pratofeito.projeto.model.enums.TipoOcorrencia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class OcorrenciaUpdateDTO {

    @NotBlank @Size(max = 40)
    private String titulo;

    @Size(max = 200)
    private String descricao;

    private TipoOcorrencia tipo;

    @Size(max = 30)
    private String categoria;

    @Size(max = 60)
    private String localizacao;

    @Size(max = 30)
    private String estadoDoacao;

    @Size(max = 30)
    private String imagem;

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public TipoOcorrencia getTipo() {
        return tipo;
    }

    public void setTipo(TipoOcorrencia tipo) {
        this.tipo = tipo;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getLocalizacao() {
        return localizacao;
    }

    public void setLocalizacao(String localizacao) {
        this.localizacao = localizacao;
    }

    public String getEstadoDoacao() {
        return estadoDoacao;
    }

    public void setEstadoDoacao(String estadoDoacao) {
        this.estadoDoacao = estadoDoacao;
    }

    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }
}