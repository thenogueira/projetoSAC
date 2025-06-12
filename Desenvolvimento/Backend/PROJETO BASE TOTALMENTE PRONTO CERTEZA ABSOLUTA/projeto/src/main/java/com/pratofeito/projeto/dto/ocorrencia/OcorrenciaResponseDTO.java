package com.pratofeito.projeto.dto.ocorrencia;

import com.pratofeito.projeto.model.enums.TipoOcorrencia;

import java.time.LocalDateTime;

public class OcorrenciaResponseDTO {
    public Long id;
    public String titulo;
    public String descricao;
    public TipoOcorrencia tipo;
    public String categoria;
    public String localizacao;
    public String estado_doacao;
    public String imagem;
    public LocalDateTime data_criacao;
    public LocalDateTime data_atualizacao;
    public Long usuarioId;
    public String usuarioNome;

    public OcorrenciaResponseDTO(com.pratofeito.projeto.model.Ocorrencia ocorrencia) {
        this.id = ocorrencia.getId();
        this.titulo = ocorrencia.getTitulo();
        this.descricao = ocorrencia.getDescricao();
        this.tipo = ocorrencia.getTipo();
        this.categoria = ocorrencia.getCategoria();
        this.localizacao = ocorrencia.getLocalizacao();
        this.estado_doacao = ocorrencia.getEstadoDoacao();
        this.imagem = ocorrencia.getImagem();
        this.data_criacao = ocorrencia.getDataCriacao();
        this.data_atualizacao = ocorrencia.getDataAtualizacao();
        this.usuarioId = ocorrencia.getUsuario().getId();
        this.usuarioNome = ocorrencia.getUsuario().getNome();
    }
}
