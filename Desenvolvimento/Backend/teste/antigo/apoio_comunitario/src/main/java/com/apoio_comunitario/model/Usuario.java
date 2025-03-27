package com.apoio_comunitario.model; // Pacote onde a classe está localizada

import jakarta.persistence.*; // Importa as anotações do Jakarta Persistence para mapeamento de entidades
import org.springframework.security.core.GrantedAuthority; // Importa a interface para autoridades de segurança
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Importa a classe para criar autoridades simples

import java.util.Collection; // Importa a classe Collection para trabalhar com coleções
import java.util.List; // Importa a classe List para trabalhar com listas
import java.util.stream.Collectors; // Importa a classe para trabalhar com streams

@Entity // Indica que esta classe é uma entidade JPA
public class Usuario {

    @Id // Indica que este campo é a chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Indica que o valor será gerado automaticamente pelo banco de dados
    private int id; // ID do usuário

    private String nome; // Nome do usuário
    private String email; // Email do usuário
    private String senha_hash; // Senha do usuário (armazenada como hash)

    @Enumerated(EnumType.STRING) // Indica que o valor será armazenado como uma string no banco de dados
    private TipoDocumento tipo_documento; // Tipo de documento (CPF ou CNPJ)

    private String numero_documento; // Número do documento (CPF ou CNPJ)

    @Enumerated(EnumType.STRING) // Indica que o valor será armazenado como uma string no banco de dados
    private TipoConta tipo_conta; // Define se é "Usuario" ou "Administrador"

    // Getters e Setters
    public int getId() {
        return id; // Retorna o ID do usuário
    }

    public void setId(int id) {
        this.id = id; // Define o ID do usuário
    }

    public String getNome() {
        return nome; // Retorna o nome do usuário
    }

    public void setNome(String nome) {
        this.nome = nome; // Define o nome do usuário
    }

    public String getEmail() {
        return email; // Retorna o email do usuário
    }

    public void setEmail(String email) {
        this.email = email; // Define o email do usuário
    }

    public String getSenha_hash() {
        return senha_hash; // Retorna a senha hash do usuário
    }

    public void setSenha_hash(String senha_hash) {
        this.senha_hash = senha_hash; // Define a senha hash do usuário
    }

    public TipoDocumento getTipo_documento() {
        return tipo_documento; // Retorna o tipo de documento do usuário
    }

    public void setTipo_documento(TipoDocumento tipo_documento) {
        this.tipo_documento = tipo_documento; // Define o tipo de documento do usuário
    }

    public String getNumero_documento() {
        return numero_documento; // Retorna o número do documento do usuário
    }

    public void setNumero_documento(String numero_documento) {
        this.numero_documento = numero_documento; // Define o número do documento do usuário
    }

    public TipoConta getTipo_conta() {
        return tipo_conta; // Retorna o tipo de conta do usuário
    }

    public void setTipo_conta(TipoConta tipo_conta) {
        this.tipo_conta = tipo_conta; // Define o tipo de conta do usuário
    }

    // Método que retorna as autoridades do usuário para controle de acesso
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(tipo_conta.name())); // Retorna a autoridade baseada no tipo de conta
    }

    // Enum que define os tipos de conta
    public enum TipoConta {
        Usuario, // Tipo de conta para usuários comuns
        Administrador // Tipo de conta para administradores
    }

    // Enum que define os tipos de documento
    public enum TipoDocumento {
        CPF, // Tipo de documento CPF
        CNPJ // Tipo de documento CNPJ
    }
}