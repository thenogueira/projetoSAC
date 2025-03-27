package com.pratofeito.projeto.model.enums;

/**
 * Enum que representa os tipos de conta disponíveis no sistema.
 * Este enum é utilizado para definir os papéis ou níveis de acesso dos usuários.
 */
public enum TipoConta {

    /**
     * Tipo de conta para usuários comuns.
     * Usuários com esse tipo têm permissões padrão no sistema.
     */
    Usuario,

    /**
     * Tipo de conta para administradores.
     * Usuários com esse tipo têm permissões elevadas, como gerenciamento de outros usuários e configurações do sistema.
     */
    Administrador
}