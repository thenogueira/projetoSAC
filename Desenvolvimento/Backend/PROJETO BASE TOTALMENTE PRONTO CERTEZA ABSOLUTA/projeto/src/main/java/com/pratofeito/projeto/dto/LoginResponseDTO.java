package com.pratofeito.projeto.dto;

public record LoginResponseDTO(
        String token,
        String errorMessage
) {
    public LoginResponseDTO(String token) {
        this(token, null);
    }
}
