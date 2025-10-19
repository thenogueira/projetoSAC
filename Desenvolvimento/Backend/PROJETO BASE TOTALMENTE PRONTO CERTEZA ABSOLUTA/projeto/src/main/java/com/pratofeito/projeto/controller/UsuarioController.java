package com.pratofeito.projeto.controller;

import com.pratofeito.projeto.dto.usuario.BanirUsuarioDTO;
import com.pratofeito.projeto.dto.usuario.UsuarioCreateDTO;
import com.pratofeito.projeto.dto.usuario.UsuarioResponseDTO;
import com.pratofeito.projeto.dto.usuario.UsuarioUpdateDTO;
import com.pratofeito.projeto.mapper.UsuarioMapper;
import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.model.enums.StatusConta;
import com.pratofeito.projeto.service.UsuarioService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Controlador REST para operações relacionadas a usuários.
 * Responsável por gerenciar as requisições HTTP e orquestrar as operações
 * de CRUD (Create, Read, Update, Delete) para a entidade Usuario.
 *
 * Mapeado para o caminho base "/usuarios" e permite requisições de qualquer origem (CORS).
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    } // Serviço que contém a lógica de negócio para usuários


    /**
     * Recupera todos os usuários cadastrados no sistema.
     *
     * @return Lista de UsuarioResponseDTO contendo os dados públicos de todos os usuários
     * @apiNote GET /usuarios/listar
     * @response HTTP 200 (OK) com a lista de usuários
     */
    @GetMapping("/listar")
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarUsuarios();
        List<UsuarioResponseDTO> response = usuarios.stream()
                .map(UsuarioMapper::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * Cria um novo usuário no sistema.
     *
     * @param usuarioCreateDTO DTO contendo os dados necessários para criação do usuário
     * @return UsuarioResponseDTO com os dados do usuário criado
     * @apiNote POST /usuarios/criar
     * @response HTTP 200 (OK) com os dados do usuário criado
     * @response HTTP 400 (Bad Request) se os dados de entrada forem inválidos
     */
    @PostMapping("/criar")
    public ResponseEntity<UsuarioResponseDTO> criarUsuario(@Valid @RequestBody UsuarioCreateDTO usuarioCreateDTO) {
        try {
            // Converte DTO para entidade
            Usuario usuario = UsuarioMapper.toEntity(usuarioCreateDTO);

            // Salva o usuário (o serviço deve tratar a criptografia da senha)
            Usuario usuarioSalvo = usuarioService.salvarUsuario(usuario);

            // Converte a entidade salva de volta para DTO de resposta
            return ResponseEntity.ok(UsuarioMapper.toResponseDTO(usuarioSalvo));

        } catch (Exception e) {
            // Log do erro para debug
            System.err.println("Erro ao criar usuário: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Atualiza os dados de um usuário existente.
     *
     * @param id ID do usuário a ser atualizado
     * @param usuarioUpdateDTO DTO contendo os dados atualizados do usuário (todos opcionais)
     * @return ResponseEntity com os dados atualizados do usuário
     * @throws ResponseStatusException HTTP 409 (Conflict) se o e-mail já estiver em uso
     * @throws ResponseStatusException HTTP 409 (Conflict) se o número do documento já estiver em uso
     * @throws ResponseStatusException HTTP 404 (Not Found) se o usuário não existir
     * @apiNote PUT /usuarios/atualizar/{id}
     * @response HTTP 200 (OK) com os dados atualizados do usuário
     */
    @PutMapping("/atualizar/{id}")
    public ResponseEntity<?> atualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateDTO usuarioUpdateDTO) {

        try {
            // Verifica se o novo e-mail já está em uso por outro usuário
            if (usuarioUpdateDTO.getEmail() != null) {
                Optional<Usuario> usuarioComEmail = usuarioService.buscarPorEmail(usuarioUpdateDTO.getEmail());
                if (usuarioComEmail.isPresent() && !usuarioComEmail.get().getId().equals(id)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "O e-mail já está em uso por outro usuário");
                }
            }

            // Verifica se o novo número do documento já está em uso por outro usuário
            if (usuarioUpdateDTO.getNumeroDocumento() != null) {
                Optional<Usuario> usuarioComDocumento = usuarioService.buscarPorNumeroDocumento(usuarioUpdateDTO.getNumeroDocumento());
                if (usuarioComDocumento.isPresent() && !usuarioComDocumento.get().getId().equals(id)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "O número do documento já está em uso por outro usuário");
                }
            }

            // Chama o serviço para atualizar o usuário
            Usuario usuario = usuarioService.atualizarUsuario(id, usuarioUpdateDTO);

            // Retorna o usuário atualizado convertido para DTO
            return ResponseEntity.ok(UsuarioMapper.toResponseDTO(usuario));

        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado com o ID: " + id);
        }
    }

    /**
     * Remove um usuário do sistema.
     *
     * @param id ID do usuário a ser removido
     * @return ResponseEntity vazio com status 200 (OK) em caso de sucesso
     * @throws ResponseStatusException HTTP 404 (Not Found) se o usuário não existir
     * @apiNote DELETE /usuarios/deletar/{id}
     * @response HTTP 200 (OK) se o usuário for removido com sucesso
     */
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable Long id) {
        try {
            // Chama o serviço para deletar o usuário
            usuarioService.deletarUsuario(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado com o ID: " + id);
        }
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping("/banir/{id}")
    public ResponseEntity<?> banirUsuario(
            @PathVariable Integer id,
            @RequestBody BanirUsuarioDTO banirDTO) {

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Usuario admin = (Usuario) authentication.getPrincipal();
            usuarioService.banirUsuario(id.longValue(), admin.getId().longValue(), banirDTO.getMotivo());
            return ResponseEntity.ok().body("Usuário banido com sucesso");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao banir usuário: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/checar-status/{id}")
    public ResponseEntity<StatusConta> checarStatus(@PathVariable Long id) {
        try {
            StatusConta status = usuarioService.checarStatus(id);
            return ResponseEntity.ok(status);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/listar/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarUsuarioPorId(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioService.buscarUsuarioPorId(id);
            UsuarioResponseDTO response = UsuarioMapper.toResponseDTO(usuario);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado com o ID: " + id);
        }
    }

}