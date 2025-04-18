package com.pratofeito.projeto.service;

import com.pratofeito.projeto.dto.ocorrencia.OcorrenciaUpdateDTO;
import com.pratofeito.projeto.model.Ocorrencia;
import com.pratofeito.projeto.repository.OcorrenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public Ocorrencia editarOcorrencia(Integer id, OcorrenciaUpdateDTO ocorrenciaDTO) {
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

}