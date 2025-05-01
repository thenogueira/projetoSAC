package com.pratofeito.projeto.repository;

import com.pratofeito.projeto.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {
}
