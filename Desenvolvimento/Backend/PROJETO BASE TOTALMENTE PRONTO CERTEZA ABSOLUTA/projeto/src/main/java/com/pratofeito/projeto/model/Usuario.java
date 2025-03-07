package com.pratofeito.projeto.model;

import com.pratofeito.projeto.model.enums.TipoConta;
import com.pratofeito.projeto.model.enums.TipoDocumento;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Collection;
import java.util.List;


/**
 * Classe que representa a entidade Usuário no sistema.
 * Esta classe é mapeada para a tabela "usuario" no banco de dados.
 * Utiliza anotações do JPA para definir a estrutura da tabela e do Spring para validações.
 */
@Getter // Lombok: gera automaticamente os métodos getters
@Setter // Lombok: gera automaticamente os métodos setters
@Table(name = "usuario") // Define o nome da tabela no banco de dados
@Entity // Indica que esta classe é uma entidade JPA
public class Usuario implements UserDetails {

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
    private TipoDocumento tipo_documento;

    /**
     * Número do documento do usuário.
     * Campo obrigatório com no máximo 14 caracteres.
     */



    @Column(name = "numero_documento", length = 14, nullable = false) // Define o nome da coluna e suas propriedades no banco de dados
    private String numero_documento;

    /**
     * Tipo de conta do usuário (ADMIN, CLIENTE, etc.).
     * Utiliza o enum TipoConta para definir os papéis do usuário.
     */
    @Enumerated(EnumType.STRING) // Define que o valor do enum será armazenado como String no banco de dados
    @Column(name = "tipo_conta") // Define o nome da coluna no banco de dados
    private TipoConta tipo_conta;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Converte o tipo_conta para uma autoridade (role) do Spring Security
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.tipo_conta.name()));
    }

    @Override
    public String getPassword() {
        return getSenha_hash();
    }

    @Override
    public String getUsername() {
        return getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // A conta não expirou
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // A conta não está bloqueada
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // As credenciais não expiraram
    }

    @Override
    public boolean isEnabled() {
        return true; // A conta está ativa
    }
}