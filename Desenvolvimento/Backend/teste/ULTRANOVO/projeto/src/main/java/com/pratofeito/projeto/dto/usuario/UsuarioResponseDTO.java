package com.pratofeito.projeto.dto.usuario;

import com.pratofeito.projeto.model.enums.TipoConta;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioResponseDTO {

    private int id;
    private String nome;
    private String email;
    private TipoConta tipo_conta;


}