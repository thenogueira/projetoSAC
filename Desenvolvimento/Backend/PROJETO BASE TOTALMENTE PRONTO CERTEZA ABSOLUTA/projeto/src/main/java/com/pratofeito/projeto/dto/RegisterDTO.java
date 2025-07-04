package com.pratofeito.projeto.dto;

import com.pratofeito.projeto.model.enums.StatusConta;
import com.pratofeito.projeto.model.enums.TipoConta;
import com.pratofeito.projeto.model.enums.TipoDocumento;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterDTO(
        @NotBlank(message = "O email é obrigatório!")
        @Email(message = "Insira um email válido!")
        String email,

        @NotBlank(message = "A senha é obrigatória!")
        @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$",
                message = "A senha deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula, 1 número, 1 caractere especial (@#$%^&+=!) e não pode conter espaços"
        )
        String senha_hash,

        TipoConta tipoConta,

        @NotBlank(message = "O nome é obrigatório!")
        @Size(max = 30, message = "O nome deve ter no máximo 30 caracteres")
        String nome,

        TipoDocumento tipoDocumento,

        @NotBlank(message = "O número do documento é obrigatório!")
        String numeroDocumento,

        StatusConta statusConta
) {}