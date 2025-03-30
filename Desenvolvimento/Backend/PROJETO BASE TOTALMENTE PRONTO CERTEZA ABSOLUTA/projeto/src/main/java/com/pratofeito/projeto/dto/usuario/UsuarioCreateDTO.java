package com.pratofeito.projeto.dto.usuario;

import com.pratofeito.projeto.model.enums.TipoConta;
import com.pratofeito.projeto.model.enums.TipoDocumento;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


public class UsuarioCreateDTO {

    @NotBlank(message = "O nome é obrigatório!")
    @Size(max = 30, message = "O nome deve ter no máximo 30 caracteres")
    private String nome;

    @Email(message = "Insira um email válido!")
    @NotBlank(message = "O email é obrigatório!")
    private String email;

    @NotBlank(message = "A senha é obrigatória!")
    private String senha; // Note que aqui é "senha", não "senha_hash"

    private TipoDocumento tipo_documento;

    private String numero_documento;

    private TipoConta tipoConta;

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

    public TipoDocumento getTipo_documento() {
        return tipo_documento;
    }

    public void setTipo_documento(TipoDocumento tipo_documento) {
        this.tipo_documento = tipo_documento;
    }

    public String getNumero_documento() {
        return numero_documento;
    }

    public void setNumero_documento(String numero_documento) {
        this.numero_documento = numero_documento;
    }

    public TipoConta getTipo_conta() {
        return tipoConta;
    }

    public void setTipo_conta(TipoConta tipo_conta) {
        this.tipoConta = tipo_conta;
    }
}