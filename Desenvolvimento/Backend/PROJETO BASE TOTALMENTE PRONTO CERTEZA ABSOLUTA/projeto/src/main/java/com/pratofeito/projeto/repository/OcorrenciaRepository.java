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
    List<Ocorrencia> findByCategoria(String categoria);
    List<Ocorrencia> findByLocalizacaoContainingIgnoreCase(String localizacao);

    @Query("SELECT o FROM Ocorrencia o WHERE " +
            "(:tipo IS NULL OR o.tipo = :tipo) AND " +
            "(:categoria IS NULL OR LOWER(o.categoria) LIKE LOWER(CONCAT('%', :categoria, '%'))) AND " +
            "(:localizacao IS NULL OR LOWER(o.localizacao) LIKE LOWER(CONCAT('%', :localizacao, '%'))) AND " +
            "(:data IS NULL OR DATE(o.dataCriacao) = :data)")
    List<Ocorrencia> findWithFilters(
            @Param("tipo") TipoOcorrencia tipo,
            @Param("categoria") String categoria,
            @Param("localizacao") String localizacao,
            @Param("data") LocalDate data);
}