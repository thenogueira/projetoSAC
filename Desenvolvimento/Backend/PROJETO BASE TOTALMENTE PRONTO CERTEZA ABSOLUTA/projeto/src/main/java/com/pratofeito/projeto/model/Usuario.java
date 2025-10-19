package com.pratofeito.projeto.model;

import com.pratofeito.projeto.model.enums.StatusConta;
import com.pratofeito.projeto.model.enums.TipoConta;
import com.pratofeito.projeto.model.enums.TipoDocumento;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
     * @param nome Nome do usuário.
     * @param email Email do usuário.
     * @param senha_hash Senha criptografada do usuário.
     * @param tipoConta Tipo de conta do usuário (USUARIO, ADMINISTRADOR).
     * @param tipoDocumento Tipo de documento do usuário (CPF, CNPJ).
     * @param numeroDocumento Número do documento do usuário.
     * @param statusConta Status da conta do usuário (ATIVA, BANIDA).
     */
    public Usuario(String nome, String email, String senha_hash, TipoConta tipoConta,
                   TipoDocumento tipoDocumento, String numeroDocumento, StatusConta statusConta) {
        this.nome = nome;
        this.email = email;
        this.senha_hash = senha_hash;
        this.tipoConta = tipoConta;
        this.tipoDocumento = tipoDocumento;
        this.numeroDocumento = numeroDocumento;
        this.statusConta = statusConta;
    }

    public Usuario() {}

    /**
     * Identificador único do usuário.
     * Gerado automaticamente pelo banco de dados com auto-incremento.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /**
     * Nome do usuário.
     * Campo obrigatório com no máximo 30 caracteres.
     */
    @NotBlank(message = "O nome é obrigatório!")
    @Size(max = 30, message = "O nome deve ter no máximo 30 caracteres")
    @Column(name = "nome", length = 30, nullable = false)
    private String nome;

    /**
     * Tipo de conta do usuário (USUARIO, ADMINISTRADOR).
     * Campo obrigatório com valor padrão USUARIO.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_conta", nullable = false)
    private TipoConta tipoConta = TipoConta.USUARIO;

    /**
     * Email do usuário.
     * Campo obrigatório com no máximo 60 caracteres e único.
     */
    @Email(message = "Insira um email válido!")
    @NotBlank(message = "O email é obrigatório!")
    @Column(name = "email", length = 60, nullable = false, unique = true)
    private String email;

    /**
     * Senha criptografada do usuário.
     * Campo obrigatório com validação de complexidade.
     */
    @NotBlank(message = "A senha é obrigatória!")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$",
            message = "A senha deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula, 1 número, 1 caractere especial (@#$%^&+=!) e não pode conter espaços"
    )
    @Column(name = "senha_hash", nullable = false, length = 255)
    private String senha_hash;

    /**
     * Tipo de documento do usuário (CPF, CNPJ).
     * Campo obrigatório.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false)
    private TipoDocumento tipoDocumento;

    /**
     * Número do documento do usuário.
     * Campo obrigatório com no máximo 14 caracteres e único.
     */
    @NotBlank(message = "O número do documento é obrigatório!")
    @Size(max = 14, message = "O número do documento deve ter no máximo 14 caracteres")
    @Column(name = "numero_documento", length = 14, nullable = false, unique = true)
    private String numeroDocumento;

    /**
     * Status da conta do usuário (ATIVA, BANIDA).
     * Campo opcional com valor padrão ATIVA.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status_conta")
    private StatusConta statusConta = StatusConta.ATIVA;

    /**
     * URL, caminho ou nome do arquivo da foto de perfil do usuário.
     * Campo opcional para armazenar referência à imagem.
     */
    @Column(name = "foto_perfil")
    private String fotoPerfil;

    /**
     * Descrição/biografia do usuário.
     * Campo opcional para texto longo.
     */
    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    /**
     * Retorna as autoridades (roles) do usuário.
     * Converte o tipo_conta para uma autoridade do Spring Security.
     *
     * @return Lista de autoridades do usuário.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.tipoConta.name()));
    }

    /**
     * Retorna a senha do usuário.
     *
     * @return Senha criptografada do usuário.
     */
    @Override
    public String getPassword() {
        return this.senha_hash;
    }

    /**
     * Retorna o email do usuário como nome de usuário.
     *
     * @return Email do usuário.
     */
    @Override
    public String getUsername() {
        return this.email;
    }

    /**
     * Verifica se a conta do usuário não expirou.
     *
     * @return true, pois a conta nunca expira.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Verifica se a conta do usuário não está bloqueada.
     * Considera o status da conta para determinar se está bloqueada.
     *
     * @return false se a conta estiver banida, true caso contrário.
     */
    @Override
    public boolean isAccountNonLocked() {
        return this.statusConta != StatusConta.BANIDA;
    }

    /**
     * Verifica se as credenciais do usuário não expiraram.
     *
     * @return true, pois as credenciais nunca expiram.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Verifica se a conta do usuário está ativa.
     *
     * @return true se a conta estiver ativa, false caso contrário.
     */
    @Override
    public boolean isEnabled() {
        return this.statusConta == StatusConta.ATIVA;
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public void setTipoDocumento(TipoDocumento tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }

    public TipoConta getTipoConta() {
        return tipoConta;
    }

    public void setTipoConta(TipoConta tipoConta) {
        this.tipoConta = tipoConta;
    }

    public StatusConta getStatusConta() {
        return statusConta;
    }

    public void setStatusConta(StatusConta statusConta) {
        this.statusConta = statusConta;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}