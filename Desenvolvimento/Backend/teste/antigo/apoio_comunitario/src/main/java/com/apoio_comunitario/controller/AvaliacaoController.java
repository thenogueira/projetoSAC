package com.apoio_comunitario.controller; // Pacote onde a classe está localizada

import com.apoio_comunitario.model.Avaliacao; // Importa a classe Avaliacao, que representa a avaliação
import com.apoio_comunitario.service.AvaliacaoService; // Importa o serviço que contém a lógica de negócios para avaliações
import org.springframework.beans.factory.annotation.Autowired; // Importa a anotação para injeção de dependência
import org.springframework.web.bind.annotation.*; // Importa as anotações para criar um controlador REST

import java.util.List; // Importa a classe List para trabalhar com listas de avaliações

@RestController // Indica que esta classe é um controlador REST
@RequestMapping("/avaliacoes") // Define a URL base para os endpoints deste controlador
public class AvaliacaoController {

    @Autowired // Permite que o Spring injete a instância do AvaliacaoService automaticamente
    private AvaliacaoService avaliacaoService; // Declaração do serviço de avaliações

    // Endpoint para listar todas as avaliações
    @GetMapping // Mapeia requisições GET para este método
    public List<Avaliacao> listarAvaliacoes() {
        return avaliacaoService.listarAvaliacoes(); // Chama o serviço para obter a lista de avaliações
    }

    // Endpoint para criar uma nova avaliação
    @PostMapping // Mapeia requisições POST para este método
    public Avaliacao criarAvaliacao(@RequestBody Avaliacao avaliacao) {
        return avaliacaoService.salvarAvaliacao(avaliacao); // Chama o serviço para salvar a nova avaliação
    }

    // Aqui você pode adicionar mais endpoints conforme necessário
}