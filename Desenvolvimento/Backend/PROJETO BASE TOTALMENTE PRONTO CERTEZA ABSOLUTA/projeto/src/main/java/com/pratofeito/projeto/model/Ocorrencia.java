package com.pratofeito.projeto.model;

import com.pratofeito.projeto.model.enums.TipoOcorrencia;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * Classe que representa a entidade Ocorrencia no sistema.
 * Esta classe é mapeada para a tabela "ocorrencia" no banco de dados.
 * Utiliza anotações do JPA para definir a estrutura da tabela e do Spring para validações.
 */
@Getter // Lombok: gera automaticamente os métodos getters
@Setter // Lombok: gera automaticamente os métodos setters
@Table(name = "ocorrencia") // Define o nome da tabela no banco de dados
@Entity // Indica que esta classe é uma entidade JPA
public class Ocorrencia {

    /**
     * Identificador único da ocorrência.
     * Gerado automaticamente pelo banco de dados com auto-incremento.
     */
    @Id // Indica que este campo é a chave primária da tabela
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Define a estratégia de geração de valor (auto-incremento)
    private int id;

    /**
     * Usuário associado à ocorrência.
     * Relacionamento muitos-para-um com a entidade Usuario.
     */
    @ManyToOne // Define o relacionamento muitos-para-um com a entidade Usuario
    @JoinColumn(name = "usuario_id") // Define a coluna de chave estrangeira no banco de dados
    private Usuario usuario;

    /**
     * Título da ocorrência.
     * Campo obrigatório com no máximo 40 caracteres.
     */
    @NotBlank(message = "O título é obrigatório!") // Validação: o campo não pode estar em branco
    @Size(max = 40, message = "O título deve ter no máximo 40 caracteres") // Validação: tamanho máximo de 40 caracteres
    @Column(name = "titulo", length = 40, nullable = false) // Define o nome da coluna e suas propriedades no banco de dados
    private String titulo;

    /**
     * Descrição da ocorrência.
     * Campo obrigatório com no máximo 200 caracteres.
     */
    @NotBlank(message = "A descrição é obrigatória!") // Validação: o campo não pode estar em branco
    @Size(max = 200, message = "A descrição deve ter no máximo 200 caracteres") // Validação: tamanho máximo de 200 caracteres
    @Column(name = "descricao", length = 200, nullable = false) // Define o nome da coluna e suas propriedades no banco de dados
    private String descricao;

    /**
     * Tipo da ocorrência (por exemplo, DOAÇÃO, RECLAMAÇÃO, etc.).
     * Utiliza o enum TipoOcorrencia para definir os tipos de ocorrência.
     */
    @Enumerated(EnumType.STRING) // Define que o valor do enum será armazenado como String no banco de dados
    @Column(name = "tipo") // Define o nome da coluna no banco de dados
    private TipoOcorrencia tipo;

    /**
     * Categoria da ocorrência.
     * Campo obrigatório com no máximo 30 caracteres.
     */
    @NotBlank(message = "A categoria é obrigatória!") // Validação: o campo não pode estar em branco
    @Size(max = 30, message = "A categoria deve ter no máximo 30 caracteres") // Validação: tamanho máximo de 30 caracteres
    @Column(name = "categoria", length = 30, nullable = false) // Define o nome da coluna e suas propriedades no banco de dados
    private String categoria;

    /**
     * Localização da ocorrência.
     * Campo obrigatório com no máximo 60 caracteres.
     */
    @NotBlank(message = "A localização é obrigatória!") // Validação: o campo não pode estar em branco
    @Size(max = 60, message = "A localização deve ter no máximo 60 caracteres") // Validação: tamanho máximo de 60 caracteres
    @Column(name = "localizacao", length = 60, nullable = false) // Define o nome da coluna e suas propriedades no banco de dados
    private String localizacao;

    /**
     * Estado da doação associada à ocorrência.
     * Campo com no máximo 30 caracteres.
     */
    @Size(max = 30, message = "O nome deve ter no máximo 30 caracteres") // Validação: tamanho máximo de 30 caracteres
    @Column(name = "estado_doacao", length = 30, nullable = false) // Define o nome da coluna e suas propriedades no banco de dados
    private String estadoDoacao;

    /**
     * Imagem associada à ocorrência.
     * Campo com no máximo 30 caracteres (possivelmente o nome ou caminho da imagem).
     */
    @Size(max = 30, message = "O nome deve ter no máximo 30 caracteres") // Validação: tamanho máximo de 30 caracteres
    @Column(name = "imagem", length = 30, nullable = false) // Define o nome da coluna e suas propriedades no banco de dados
    private String imagem;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

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