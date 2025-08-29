package com.pratofeito.projeto.repository;

import com.pratofeito.projeto.model.Ocorrencia;
import com.pratofeito.projeto.model.enums.TipoOcorrencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

/**
 * Repositório responsável por fornecer métodos de acesso aos dados da entidade Ocorrencia.
 * Esta interface estende JpaRepository, que já inclui métodos padrão para operações CRUD.
 */
public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {
    List<Ocorrencia> findAllByOrderByDataCriacaoDesc();
    // Método para buscar por data específica
    @Query("SELECT o FROM Ocorrencia o WHERE DATE(o.dataCriacao) = :data")
    List<Ocorrencia> findByDataCriacao(@Param("data") LocalDate data);
    List<Ocorrencia> findByTipo(TipoOcorrencia tipo);
}