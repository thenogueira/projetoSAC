package com.pratofeito.projeto.repository;

import com.pratofeito.projeto.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositório responsável por fornecer métodos de acesso aos dados da entidade Avaliacao.
 * Esta interface estende JpaRepository, que já inclui métodos padrão para operações CRUD.
 */
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Integer> {
}