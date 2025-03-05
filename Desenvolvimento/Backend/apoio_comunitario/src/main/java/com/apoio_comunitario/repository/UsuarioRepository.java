package com.apoio_comunitario.repository;

import com.apoio_comunitario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Usuario findByNome(String nome); // Método para buscar usuário pelo nome de usuário
    // depois eu adiciono alguns metodo aq
}