package com.pratofeito.projeto.repository;

import com.pratofeito.projeto.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repositório responsável por fornecer métodos de acesso aos dados da entidade Usuario.
 * Esta interface estende JpaRepository, que já inclui métodos padrão para operações CRUD.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    /**
     * Busca um usuário pelo nome.
     *
     * param nome Nome do usuário a ser buscado.
     * return Um objeto Usuario correspondente ao nome fornecido, ou null se não encontrado.
     */
    Usuario findByNome(String nome);
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByNumeroDocumento(String NumeroDocumento);
}