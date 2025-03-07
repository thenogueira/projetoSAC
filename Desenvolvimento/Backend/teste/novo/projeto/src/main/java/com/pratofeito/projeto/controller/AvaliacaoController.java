package com.pratofeito.projeto.controller;

import com.pratofeito.projeto.model.Avaliacao;
import com.pratofeito.projeto.service.AvaliacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador responsável por gerenciar as requisições relacionadas à entidade Avaliacao.
 * Este controlador expõe endpoints para listar e criar avaliações.
 */
@RestController // Indica que esta classe é um controlador REST
@CrossOrigin("*") // Permite requisições de qualquer origem (CORS)
@RequestMapping("/avaliacoes") // Define o caminho base para os endpoints deste controlador
public class AvaliacaoController {

    @Autowired // Injeção de dependência automática do serviço AvaliacaoService
    private AvaliacaoService avaliacaoService;

    /**
     * Endpoint para listar todas as avaliações cadastradas no sistema.
     *
     * return Uma lista de objetos Avaliacao.
     */
    @GetMapping // Mapeia requisições GET para o caminho /avaliacoes
    public List<Avaliacao> listarAvaliacoes() {
        return avaliacaoService.listarAvaliacoes(); // Chama o método do serviço para obter a lista de avaliações
    }

    /**
     * Endpoint para criar uma nova avaliação.
     *
     * param avaliacao Objeto Avaliacao recebido no corpo da requisição.
     * return A avaliação criada e salva no banco de dados.
     */
    @PostMapping // Mapeia requisições POST para o caminho /avaliacoes
    public Avaliacao criarAvaliacao(@RequestBody Avaliacao avaliacao) { // @RequestBody indica que o objeto Avaliacao é recebido no corpo da requisição
        return avaliacaoService.salvarAvaliacao(avaliacao); // Chama o método do serviço para salvar a avaliação
    }
}