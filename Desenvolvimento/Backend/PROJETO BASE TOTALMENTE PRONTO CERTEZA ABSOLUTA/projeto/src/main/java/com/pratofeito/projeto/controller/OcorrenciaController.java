package com.pratofeito.projeto.controller;

import com.pratofeito.projeto.dto.ocorrencia.OcorrenciaResponseDTO;
import com.pratofeito.projeto.dto.ocorrencia.OcorrenciaUpdateDTO;
import com.pratofeito.projeto.model.Ocorrencia;
import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.repository.UsuarioRepository;
import com.pratofeito.projeto.service.OcorrenciaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    @CrossOrigin("*")
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
    @PostMapping("/criar")
    public ResponseEntity<OcorrenciaResponseDTO> criarOcorrencia(@Valid @RequestBody Ocorrencia ocorrencia) {
        Usuario usuario = usuarioRepository.findById(ocorrencia.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        ocorrencia.setUsuario(usuario);

        Ocorrencia salva = ocorrenciaService.salvarOcorrencia(ocorrencia);

        return ResponseEntity.ok(new OcorrenciaResponseDTO(salva));
    }

    /**
     * Endpoint para editar uma ocorrência existente
     * param id ID da ocorrência a ser editada
     * param ocorrenciaAtualizada Objeto com os novos dados
     * return Ocorrência atualizada
     */
    @PutMapping("/editar/{id}")
    public ResponseEntity<Ocorrencia> editarOcorrencia(
            @PathVariable Long id,
            @Valid @RequestBody OcorrenciaUpdateDTO ocorrenciaDTO) {

        try {
            Ocorrencia ocorrenciaEditada = ocorrenciaService.editarOcorrencia(id, ocorrenciaDTO);
            return ResponseEntity.ok(ocorrenciaEditada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint para deletar uma ocorrência existente
     * param id ID da ocorrência a ser deletada
     * return ResponseEntity com status 200 (OK) se deletado com sucesso, ou 404 (Not Found) se não encontrado
     */
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletarOcorrencia(@PathVariable Long id) {
        try {
            ocorrenciaService.deletarOcorrencia(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint para listar as 5 ocorrências mais recentes
     *
     * @return Lista das 5 ocorrências mais recentes ordenadas por data de criação (decrescente)
     */
    @CrossOrigin("*")
    @GetMapping("/recentes")
    public ResponseEntity<List<Ocorrencia>> listarRecentes() {
        List<Ocorrencia> recentes = ocorrenciaService.listarRecentes();
        return ResponseEntity.ok(recentes);
    }

}