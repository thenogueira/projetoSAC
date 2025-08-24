package com.pratofeito.projeto.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Classe que representa a entidade Avaliacao no sistema.
 * Esta classe é mapeada para uma tabela no banco de dados e armazena informações
 * sobre avaliações feitas por um usuário (avaliador) a outro usuário (avaliado).
 */

@Entity // Indica que esta classe é uma entidade JPA
public class Avaliacao {

    /**
     * Identificador único da avaliação.
     * Gerado automaticamente pelo banco de dados com auto-incremento.
     */
    @Id // Indica que este campo é a chave primária da tabela
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Define a estratégia de geração de valor (auto-incremento)
    private int id;

    /**
     * Usuário que foi avaliado.
     * Relacionamento muitos-para-um com a entidade Usuario.
     */
    @ManyToOne // Define o relacionamento muitos-para-um com a entidade Usuario
    @JoinColumn(name = "usuario_avaliado_id") // Define a coluna de chave estrangeira no banco de dados
    private Usuario usuarioAvaliado;

    /**
     * Usuário que realizou a avaliação (avaliador).
     * Relacionamento muitos-para-um com a entidade Usuario.
     */
    @ManyToOne // Define o relacionamento muitos-para-um com a entidade Usuario
    @JoinColumn(name = "usuario_avaliador_id") // Define a coluna de chave estrangeira no banco de dados
    private Usuario usuarioAvaliador;

    /**
     * Nota da avaliação.
     * Campo obrigatório que deve ser preenchido.
     */
    @NotBlank(message = "A nota é obrigatória") // Validação: o campo não pode estar em branco
    @Column(name = "nota", nullable = false) // Define o nome da coluna e suas propriedades no banco de dados
    private int nota;

    /**
     * Comentário opcional associado à avaliação.
     * Pode ser usado para fornecer feedback adicional.
     */
    @Column(name = "comentario") // Define o nome da coluna no banco de dados
    private String comentario;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Usuario getUsuarioAvaliado() {
        return usuarioAvaliado;
    }

    public void setUsuarioAvaliado(Usuario usuarioAvaliado) {
        this.usuarioAvaliado = usuarioAvaliado;
    }

    public Usuario getUsuarioAvaliador() {
        return usuarioAvaliador;
    }

    public void setUsuarioAvaliador(Usuario usuarioAvaliador) {
        this.usuarioAvaliador = usuarioAvaliador;
    }

    public int getNota() {
        return nota;
    }

    public void setNota(int nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}