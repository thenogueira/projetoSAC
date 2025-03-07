package com.pratofeito.projeto.dto.usuario;

import com.pratofeito.projeto.model.enums.TipoConta;
import com.pratofeito.projeto.model.enums.TipoDocumento;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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

    private TipoConta tipo_conta;


}