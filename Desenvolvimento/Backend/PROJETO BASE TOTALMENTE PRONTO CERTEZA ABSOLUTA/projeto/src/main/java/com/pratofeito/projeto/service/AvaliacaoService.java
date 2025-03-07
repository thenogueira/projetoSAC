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
}