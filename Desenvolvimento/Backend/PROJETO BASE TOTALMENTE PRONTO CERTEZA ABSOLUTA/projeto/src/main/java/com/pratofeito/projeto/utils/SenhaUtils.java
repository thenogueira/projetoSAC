package com.pratofeito.projeto.utils;

public class SenhaUtils {
    private static final String SENHA_PATTERN =
            "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$";

    public static boolean isSenhaForte(String senha) {
        return senha != null && senha.matches(SENHA_PATTERN);
    }

    public static void validarForcaSenha(String senha) {
        if (!isSenhaForte(senha)) {
            throw new IllegalArgumentException(
                    "A senha deve conter pelo menos: " +
                            "8 caracteres, 1 letra maiúscula, 1 letra minúscula, " +
                            "1 número, 1 caractere especial (@#$%^&+=!) e não pode conter espaços"
            );
        }
    }
}