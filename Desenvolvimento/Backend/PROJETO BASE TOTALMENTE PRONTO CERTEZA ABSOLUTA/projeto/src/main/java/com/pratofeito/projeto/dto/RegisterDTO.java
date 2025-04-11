package com.pratofeito.projeto.dto;

import com.pratofeito.projeto.model.enums.StatusConta;
import com.pratofeito.projeto.model.enums.TipoConta;
import com.pratofeito.projeto.model.enums.TipoDocumento;

public record RegisterDTO(String email,
                          String senha_hash,
                          TipoConta tipoConta,
                          String nome,
                          TipoDocumento tipoDocumento,
                          String numeroDocumento,
                          StatusConta statusConta) {
}
