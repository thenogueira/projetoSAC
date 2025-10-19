package com.pratofeito.projeto.repository;

import com.pratofeito.projeto.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {
    // Buscar comentários sobre um usuário específico (onde ele é o alvo)
    List<Comentario> findByUsuarioAlvoId(int usuarioAlvoId);

    // Buscar comentários feitos por um usuário (onde ele é o autor)
    List<Comentario> findByUsuarioId(int usuarioId);
}
