package com.pratofeito.projeto.service;

import com.pratofeito.projeto.dto.ocorrencia.OcorrenciaUpdateDTO;
import com.pratofeito.projeto.model.Ocorrencia;
import com.pratofeito.projeto.repository.OcorrenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Serviço responsável por implementar a lógica de negócio relacionada à entidade Ocorrencia.
 * Esta classe faz a intermediação entre o controlador (Controller) e o repositório (Repository).
 */
@Service
public class OcorrenciaService {

    @Autowired
    private OcorrenciaRepository ocorrenciaRepository;

    public List<Ocorrencia> listarOcorrencias() {
        return ocorrenciaRepository.findAll();
    }

    public Ocorrencia salvarOcorrencia(Ocorrencia ocorrencia) {
        return ocorrenciaRepository.save(ocorrencia);
    }

    public Ocorrencia editarOcorrencia(Long id, OcorrenciaUpdateDTO ocorrenciaDTO) {
        return ocorrenciaRepository.findById(id)
                .map(ocorrencia -> {
                    if (ocorrenciaDTO.getTitulo() != null) {
                        ocorrencia.setTitulo(ocorrenciaDTO.getTitulo());
                    }
                    if (ocorrenciaDTO.getDescricao() != null) {
                        ocorrencia.setDescricao(ocorrenciaDTO.getDescricao());
                    }
                    // Repita para todos os outros campos que deseja atualizar
                    return ocorrenciaRepository.save(ocorrencia);
                })
                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada"));
    }

    public void deletarOcorrencia(Long id) {
        if (ocorrenciaRepository.existsById(id)) {
            ocorrenciaRepository.deleteById(id);
        } else {
            throw new RuntimeException("Ocorrência não encontrada");
        }
    }

    public List<Ocorrencia> listarRecentes() {
        return ocorrenciaRepository.findAllByOrderByDataCriacaoDesc()
                .stream()
                .limit(5)
                .collect(Collectors.toList());
    }

    /**
     * Busca uma ocorrência pelo ID
     *
     * @param id ID da ocorrência
     * @return Optional com a ocorrência ou vazio se não encontrada
     */
    public Optional<Ocorrencia> buscarPorId(Long id) {
        return ocorrenciaRepository.findById(id);
    }
}