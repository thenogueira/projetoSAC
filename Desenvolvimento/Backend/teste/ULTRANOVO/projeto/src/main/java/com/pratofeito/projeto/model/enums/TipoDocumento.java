package com.pratofeito.projeto.model.enums;

/**
 * Enum que representa os tipos de documentos suportados no sistema.
 * Este enum é utilizado para identificar se um documento é um CPF (pessoa física) ou CNPJ (pessoa jurídica).
 */
public enum TipoDocumento {

    /**
     * Representa o Cadastro de Pessoas Físicas (CPF).
     * Utilizado para identificar pessoas físicas no sistema.
     */
    CPF,

    /**
     * Representa o Cadastro Nacional da Pessoa Jurídica (CNPJ).
     * Utilizado para identificar pessoas jurídicas (empresas) no sistema.
     */
    CNPJ
}