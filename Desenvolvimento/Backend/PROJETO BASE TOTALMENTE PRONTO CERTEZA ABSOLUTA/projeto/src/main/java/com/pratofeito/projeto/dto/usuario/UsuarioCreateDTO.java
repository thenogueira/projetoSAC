package com.pratofeito.projeto.dto.usuario;

import com.pratofeito.projeto.model.enums.TipoDocumento;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UsuarioCreateDTO {

    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 2, max = 30, message = "O nome deve ter entre 2 e 30 caracteres")
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "O e-mail deve ser válido")
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$",
            message = "A senha deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula, 1 número, 1 caractere especial (@#$%^&+=!) e não pode conter espaços"
    )
    private String senha;

    @NotNull(message = "O tipo de documento é obrigatório")
    private TipoDocumento tipoDocumento;

    @NotBlank(message = "O número do documento é obrigatório")
    @Size(max = 14, message = "O número do documento deve ter no máximo 14 caracteres")
    private String numeroDocumento;

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
}