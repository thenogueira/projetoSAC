package com.pratofeito.projeto.service;

import com.pratofeito.projeto.model.Avaliacao;
import com.pratofeito.projeto.repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço responsável por implementar a lógica de negócio relacionada à entidade Avaliacao.
 * Esta classe faz a intermediação entre o controlador (Controller) e o repositório (Repository).
 */
@Service // Indica que esta classe é um serviço gerenciado pelo Spring
public class AvaliacaoService {

    @Autowired // Injeção de dependência automática do repositório AvaliacaoRepository
    private AvaliacaoRepository avaliacaoRepository;

    /**
     * Retorna uma lista de todas as avaliações cadastradas no sistema.
     *
     * return Lista de objetos Avaliacao.
     */
    public List<Avaliacao> listarAvaliacoes() {
        return avaliacaoRepository.findAll(); // Chama o método do repositório para obter todas as avaliações
    }

    /**
     * Salva uma nova avaliação no banco de dados.
     *
     * param avaliacao Objeto Avaliacao a ser salvo.
     * return A avaliação salva, incluindo seu ID gerado.
     */
    public Avaliacao salvarAvaliacao(Avaliacao avaliacao) {
        return avaliacaoRepository.save(avaliacao); // Chama o método do repositório para salvar a avaliação
    }

    /**
     * Edita uma avaliação existente no banco de dados.
     *
     * @param id ID da avaliação a ser editada
     * @param avaliacao Objeto Avaliacao com os dados atualizados
     * @return A avaliação atualizada ou null se não encontrada
     */
    public Avaliacao editarAvaliacao(int id, Avaliacao avaliacao) {
        Avaliacao avaliacaoExistente = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avaliação não encontrada com o ID: " + id));

        // Atualiza os campos permitidos
        if (avaliacao.getNota() != 0) {
            avaliacaoExistente.setNota(avaliacao.getNota());
        }
        if (avaliacao.getComentario() != null) {
            avaliacaoExistente.setComentario(avaliacao.getComentario());
        }

        return avaliacaoRepository.save(avaliacaoExistente);
    }

}