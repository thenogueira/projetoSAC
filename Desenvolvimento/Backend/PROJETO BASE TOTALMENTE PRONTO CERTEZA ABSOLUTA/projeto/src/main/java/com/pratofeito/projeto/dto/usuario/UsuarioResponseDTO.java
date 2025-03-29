package com.pratofeito.projeto.dto.usuario;

import com.pratofeito.projeto.model.enums.TipoConta;
import lombok.Getter;
import lombok.Setter;


public class UsuarioResponseDTO {

    private int id;
    private String nome;
    private String email;
    private TipoConta tipoConta;


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

    public TipoConta getTipo_conta() {
        return tipoConta;
    }

    public void setTipo_conta(TipoConta tipo_conta) {
        this.tipoConta = tipo_conta;
    }
}