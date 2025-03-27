package com.pratofeito.projeto.repository;

import com.pratofeito.projeto.model.Ocorrencia;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositório responsável por fornecer métodos de acesso aos dados da entidade Ocorrencia.
 * Esta interface estende JpaRepository, que já inclui métodos padrão para operações CRUD.
 */
public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Integer> {
}