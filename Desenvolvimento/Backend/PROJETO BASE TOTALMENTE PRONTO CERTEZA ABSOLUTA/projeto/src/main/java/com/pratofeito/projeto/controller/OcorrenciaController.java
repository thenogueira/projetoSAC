package com.pratofeito.projeto.controller;

import com.pratofeito.projeto.model.Ocorrencia;
import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.repository.UsuarioRepository;
import com.pratofeito.projeto.service.OcorrenciaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador responsável por gerenciar as requisições relacionadas à entidade Ocorrencia.
 * Este controlador expõe endpoints para listar e criar ocorrências.
 */
@RestController // Indica que esta classe é um controlador REST
@CrossOrigin("*") // Permite requisições de qualquer origem (CORS)
@RequestMapping("/ocorrencias") // Define o caminho base para os endpoints deste controlador
public class OcorrenciaController {

    @Autowired // Injeção de dependência automática do serviço OcorrenciaService
    private OcorrenciaService ocorrenciaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Endpoint para listar todas as ocorrências cadastradas no sistema.
     *
     * return Uma lista de objetos Ocorrencia.
     */
    @GetMapping("/listar") // Mapeia requisições GET para o caminho /ocorrencias/listar
    public List<Ocorrencia> listarOcorrencias() {
        return ocorrenciaService.listarOcorrencias(); // Chama o método do serviço para obter a lista de ocorrências
    }

    /**
     * Endpoint para criar uma nova ocorrência.
     *
     * param ocorrencia Objeto Ocorrencia recebido no corpo da requisição.
     * return A ocorrência criada e salva no banco de dados.
     */
    @PostMapping("/criar") // Mapeia requisições POST para o caminho /ocorrencias/criar
    public Ocorrencia criarOcorrencia(@Valid @RequestBody Ocorrencia ocorrencia) { // @RequestBody indica que o objeto Ocorrencia é recebido no corpo da requisição
        // Carrega o usuário completo do banco
        Usuario usuario = usuarioRepository.findById(ocorrencia.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        ocorrencia.setUsuario(usuario); // Associa o usuário completo
        return ocorrenciaService.salvarOcorrencia(ocorrencia); // Chama o método do serviço para salvar a ocorrência
    }
}