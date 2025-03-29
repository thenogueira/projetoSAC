package com.pratofeito.projeto.model;

import com.pratofeito.projeto.model.enums.TipoConta;
import com.pratofeito.projeto.model.enums.TipoDocumento;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Classe que representa a entidade Usuário no sistema.
 * Esta classe é mapeada para a tabela "usuario" no banco de dados.
 * Implementa a interface UserDetails do Spring Security para integração com o sistema de autenticação.
 */
@Table(name = "usuario") // Define o nome da tabela no banco de dados
@Entity // Indica que esta classe é uma entidade JPA
public class Usuario implements UserDetails {

    /**
     * Construtor para criar um novo usuário.
     *
     * param nome Nome do usuário.
     * param email Email do usuário.
     * param senha_hash Senha criptografada do usuário.
     * param tipo_conta Tipo de conta do usuário (ADMIN, CLIENTE, etc.).
     * param tipo_documento Tipo de documento do usuário (CPF, CNPJ, etc.).
     * param numero_documento Número do documento do usuário.
     */

    public Usuario(){};

    public Usuario(String nome, String email, String senha_hash, TipoConta tipo_conta, TipoDocumento tipoDocumento, String numeroDocumento) {
        this.nome = nome;
        this.email = email;
        this.senha_hash = senha_hash;
        this.tipo_conta = tipo_conta;
        this.tipoDocumento = tipoDocumento;
        this.numeroDocumento = numeroDocumento;
    }

    /**
     * Identificador único do usuário.
     * Gerado automaticamente pelo banco de dados com auto-incremento.
     */
    @Id // Indica que este campo é a chave primária da tabela
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Define a estratégia de geração de valor (auto-incremento)
    @Column(name = "id") // Define o nome da coluna no banco de dados
    private int id;

    /**
     * Nome do usuário.
     * Campo obrigatório com no máximo 30 caracteres.
     */
    @NotBlank(message = "O nome é obrigatório!") // Validação: o campo não pode estar em branco
    @Size(max = 30, message = "O nome deve ter no máximo 30 caracteres") // Validação: tamanho máximo de 30 caracteres
    @Column(name = "nome", length = 30, nullable = false) // Define o nome da coluna e suas propriedades no banco de dados
    private String nome;

    /**
     * Email do usuário.
     * Campo obrigatório que deve ser um email válido.
     */
    @Email(message = "Insira um email válido!") // Validação: o campo deve ser um email válido
    @NotBlank(message = "O email é obrigatório!") // Validação: o campo não pode estar em branco
    @Column(name = "email", length = 40, nullable = false) // Define o nome da coluna e suas propriedades no banco de dados
    private String email;

    /**
     * Hash da senha do usuário.
     * Campo obrigatório que armazena a senha criptografada.
     */
    @NotBlank(message = "A senha é obrigatória!") // Validação: o campo não pode estar em branco
    @Column(name = "senha_hash", nullable = false) // Define o nome da coluna e suas propriedades no banco de dados
    private String senha_hash;

    /**
     * Tipo de documento do usuário (CPF, CNPJ, etc.).
     * Campo obrigatório que utiliza o enum TipoDocumento.
     */
    @Enumerated(EnumType.STRING) // Define que o valor do enum será armazenado como String no banco de dados
    @Column(name = "tipo_documento", nullable = false) // Define o nome da coluna e suas propriedades no banco de dados
    private TipoDocumento tipoDocumento;

    /**
     * Número do documento do usuário.
     * Campo obrigatório com no máximo 14 caracteres.
     */
    @Column(name = "numero_documento", length = 14, nullable = false) // Define o nome da coluna e suas propriedades no banco de dados
    private String numeroDocumento;

    /**
     * Tipo de conta do usuário (ADMIN, CLIENTE, etc.).
     * Utiliza o enum TipoConta para definir os papéis do usuário.
     */
    @Enumerated(EnumType.STRING) // Define que o valor do enum será armazenado como String no banco de dados
    @Column(name = "tipo_conta") // Define o nome da coluna no banco de dados
    private TipoConta tipo_conta;

    /**
     * Retorna as autoridades (roles) do usuário.
     * Converte o tipo_conta para uma autoridade do Spring Security.
     *
     * return Lista de autoridades do usuário.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.tipo_conta.name()));
    }

    /**
     * Retorna a senha do usuário.
     *
     * return Senha criptografada do usuário.
     */
    @Override
    public String getPassword() {
        return getSenha_hash();
    }

    /**
     * Retorna o email do usuário como nome de usuário.
     *
     * return Email do usuário.
     */
    @Override
    public String getUsername() {
        return getEmail();
    }

    /**
     * Verifica se a conta do usuário não expirou.
     *
     * return true, pois a conta nunca expira.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Verifica se a conta do usuário não está bloqueada.
     *
     * return true, pois a conta nunca está bloqueada.
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Verifica se as credenciais do usuário não expiraram.
     *
     * return true, pois as credenciais nunca expiram.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Verifica se a conta do usuário está ativa.
     *
     * @return true, pois a conta está sempre ativa.
     */
    @Override
    public boolean isEnabled() {
        return true;
    }

    // Getters e Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha_hash() {
        return senha_hash;
    }

    public void setSenha_hash(String senha_hash) {
        this.senha_hash = senha_hash;
    }

    public TipoDocumento getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(TipoDocumento tipo_documento) {
        this.tipoDocumento = tipo_documento;
    }

    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numero_documento) {
        this.numeroDocumento = numero_documento;
    }

    public TipoConta getTipo_conta() {
        return tipo_conta;
    }

    public void setTipo_conta(TipoConta tipo_conta) {
        this.tipo_conta = tipo_conta;
    }
}