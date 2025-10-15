package com.pratofeito.projeto.service;

import com.pratofeito.projeto.dto.ocorrencia.OcorrenciaUpdateDTO;
import com.pratofeito.projeto.model.Ocorrencia;
import com.pratofeito.projeto.model.enums.TipoOcorrencia;
import com.pratofeito.projeto.repository.OcorrenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço responsável por implementar a lógica de negócio relacionada à entidade Ocorrencia.
 * Esta classe faz a intermediação entre o controlador (Controller) e o repositório (Repository).
 */
@Service // Indica que esta classe é um serviço gerenciado pelo Spring
public class OcorrenciaService {

    @Autowired // Injeção de dependência automática do repositório OcorrenciaRepository
    private OcorrenciaRepository ocorrenciaRepository;

    /**
     * Retorna uma lista de todas as ocorrências cadastradas no sistema.
     *
     * return Lista de objetos Ocorrencia.
     */
    public List<Ocorrencia> listarOcorrencias() {
        return ocorrenciaRepository.findAll(); // Chama o método do repositório para obter todas as ocorrências
    }

    public List<Ocorrencia> listarPorData(LocalDate data) {
        return ocorrenciaRepository.findByDataCriacao(data);
    }

    /**
     * Salva uma nova ocorrência no banco de dados.
     *
     * param ocorrencia Objeto Ocorrencia a ser salvo.
     * return A ocorrência salva, incluindo seu ID gerado.
     */
    public Ocorrencia salvarOcorrencia(Ocorrencia ocorrencia) {
        return ocorrenciaRepository.save(ocorrencia); // Chama o método do repositório para salvar a ocorrência
    }

    /**
     * Edita uma ocorrência existente
     * param id ID da ocorrência
     * param ocorrenciaAtualizada Dados atualizados
     * @return Ocorrência editada
     * @throws RuntimeException Se a ocorrência não for encontrada
     */
    public Ocorrencia editarOcorrencia(Long id, OcorrenciaUpdateDTO ocorrenciaDTO) {
        return ocorrenciaRepository.findById(id)
                .map(ocorrencia -> {
                    if (ocorrenciaDTO.getTitulo() != null) {
                        ocorrencia.setTitulo(ocorrenciaDTO.getTitulo());
                    }
                    if (ocorrenciaDTO.getDescricao() != null) {
                        ocorrencia.setDescricao(ocorrenciaDTO.getDescricao());
                    }
                    // Repita para todos os outros campos
                    return ocorrenciaRepository.save(ocorrencia);
                })
                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada"));
    }

    /**
     * Deleta uma ocorrência pelo ID
     * param id ID da ocorrência a ser deletada
     * throws RuntimeException Se a ocorrência não for encontrada
     */
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

    public Ocorrencia buscarPorId(Long id) {
        return ocorrenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada"));
    }

    public List<Ocorrencia> listarPorTipo(TipoOcorrencia tipo) {
        return ocorrenciaRepository.findByTipo(tipo);
    }

    public List<Ocorrencia> listarPorCategoria(String categoria) {
        return ocorrenciaRepository.findByCategoria(categoria);
    }

    public List<Ocorrencia> listarPorLocalizacao(String localizacao) {
        return ocorrenciaRepository.findByLocalizacaoContainingIgnoreCase(localizacao);
    }

}