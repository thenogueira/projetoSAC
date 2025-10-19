package com.pratofeito.projeto.dto.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * DTO para atualização de um usuário existente.
 * Contém apenas os campos que podem ser modificados após a criação.
 * Todos os campos são opcionais para permitir atualizações parciais.
 */
public class UsuarioUpdateDTO {

    @Size(min = 2, max = 30, message = "O nome deve ter entre 2 e 30 caracteres")
    private String nome;

    @Email(message = "O e-mail deve ser válido")
    private String email;

    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$",
            message = "A senha deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula, 1 número, 1 caractere especial (@#$%^&+=!) e não pode conter espaços"
    )
    private String senha;

    @Size(max = 14, message = "O número do documento deve ter no máximo 14 caracteres")
    private String numeroDocumento;

    @Size(max = 255, message = "A URL da foto deve ter no máximo 255 caracteres")
    private String fotoPerfil;

    private String descricao;

    // Getters e Setters
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

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
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