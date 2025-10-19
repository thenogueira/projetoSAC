package com.pratofeito.projeto.service;

import com.pratofeito.projeto.dto.usuario.UsuarioUpdateDTO;
import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.model.UsuarioBanido;
import com.pratofeito.projeto.model.enums.StatusConta;
import com.pratofeito.projeto.model.enums.TipoConta;
import com.pratofeito.projeto.model.enums.TipoDocumento;
import com.pratofeito.projeto.repository.UsuarioBanidoRepository;
import com.pratofeito.projeto.repository.UsuarioRepository;
import com.pratofeito.projeto.utils.SenhaUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

/**
 * Serviço responsável por implementar a lógica de negócio relacionada à entidade Usuario.
 * Esta classe faz a intermediação entre o controlador (Controller) e o repositório (Repository),
 * garantindo que as regras de negócio sejam aplicadas antes de persistir ou recuperar dados.
 */
@Service
public class UsuarioService implements UserDetails {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioBanidoRepository usuarioBanidoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Retorna uma lista de todos os usuários cadastrados no sistema.
     */
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    /**
     * Salva um novo usuário no banco de dados, aplicando validações necessárias.
     */
    public Usuario salvarUsuario(Usuario usuario) {
        this.validarDocumento(usuario);
        SenhaUtils.validarForcaSenha(usuario.getSenha_hash());
        // Criptografa a senha antes de salvar
        usuario.setSenha_hash(passwordEncoder.encode(usuario.getSenha_hash()));
        return usuarioRepository.save(usuario);
    }

    /**
     * Valida o documento do usuário com base no tipo de documento (CPF ou CNPJ).
     */
    private void validarDocumento(Usuario usuario) {
        String numeroDocumento = usuario.getNumeroDocumento();
        TipoDocumento tipoDocumento = usuario.getTipoDocumento();

        // Validação para CPF
        if ((tipoDocumento == TipoDocumento.CPF) && (numeroDocumento.length() != 11)) {
            throw new IllegalArgumentException("O CPF deve ter 11 caracteres.");
        }

        // Validação para CNPJ
        if ((tipoDocumento == TipoDocumento.CNPJ) && (numeroDocumento.length() != 14)) {
            throw new IllegalArgumentException("O CNPJ deve ter 14 caracteres.");
        }
    }

    /**
     * Atualiza os dados de um usuário existente com base no DTO de atualização.
     * Todos os campos são opcionais - apenas os campos fornecidos serão atualizados.
     */
    @Transactional
    public Usuario atualizarUsuario(Long id, UsuarioUpdateDTO usuarioUpdateDTO) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + id));

        // Atualiza nome se fornecido
        if (usuarioUpdateDTO.getNome() != null && !usuarioUpdateDTO.getNome().trim().isEmpty()) {
            usuarioExistente.setNome(usuarioUpdateDTO.getNome());
        }

        // Atualiza email se fornecido
        if (usuarioUpdateDTO.getEmail() != null && !usuarioUpdateDTO.getEmail().trim().isEmpty()) {
            usuarioExistente.setEmail(usuarioUpdateDTO.getEmail());
        }

        // Atualiza senha se fornecida (com validação e criptografia)
        if (usuarioUpdateDTO.getSenha() != null && !usuarioUpdateDTO.getSenha().trim().isEmpty()) {
            SenhaUtils.validarForcaSenha(usuarioUpdateDTO.getSenha());
            usuarioExistente.setSenha_hash(passwordEncoder.encode(usuarioUpdateDTO.getSenha()));
        }

        // Atualiza número do documento se fornecido (com validação)
        if (usuarioUpdateDTO.getNumeroDocumento() != null && !usuarioUpdateDTO.getNumeroDocumento().trim().isEmpty()) {
            // Valida o novo documento antes de atualizar
            validarDocumentoAtualizacao(usuarioExistente.getTipoDocumento(), usuarioUpdateDTO.getNumeroDocumento());
            usuarioExistente.setNumeroDocumento(usuarioUpdateDTO.getNumeroDocumento());
        }

        // Atualiza foto de perfil se fornecida
        if (usuarioUpdateDTO.getFotoPerfil() != null) {
            usuarioExistente.setFotoPerfil(usuarioUpdateDTO.getFotoPerfil());
        }

        // Atualiza descrição se fornecida
        if (usuarioUpdateDTO.getDescricao() != null) {
            usuarioExistente.setDescricao(usuarioUpdateDTO.getDescricao());
        }

        return usuarioRepository.save(usuarioExistente);
    }

    /**
     * Valida o documento durante a atualização.
     */
    private void validarDocumentoAtualizacao(TipoDocumento tipoDocumento, String numeroDocumento) {
        // Validação para CPF
        if ((tipoDocumento == TipoDocumento.CPF) && (numeroDocumento.length() != 11)) {
            throw new IllegalArgumentException("O CPF deve ter 11 caracteres.");
        }

        // Validação para CNPJ
        if ((tipoDocumento == TipoDocumento.CNPJ) && (numeroDocumento.length() != 14)) {
            throw new IllegalArgumentException("O CNPJ deve ter 14 caracteres.");
        }
    }

    /**
     * Busca usuário por número do documento (para verificação de duplicatas)
     */
    public Optional<Usuario> buscarPorNumeroDocumento(String numeroDocumento) {
        return usuarioRepository.findByNumeroDocumento(numeroDocumento);
    }

    /**
     * Busca usuário por ID
     */
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + id));
    }

    public Usuario buscarUsuarioPorId(Long id) {
        return buscarPorId(id); // Reutiliza o método existente
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public void deletarUsuario(Long id) {
        usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com o ID: " + id));
        usuarioRepository.deleteById(id);
    }

    @Transactional
    public void banirUsuario(Long usuarioId, Long adminId, String motivo) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        if (usuario.getTipoConta() == TipoConta.ADMINISTRADOR) {
            throw new IllegalStateException("Não é possível banir outro administrador");
        }

        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new EntityNotFoundException("Administrador não encontrado"));

        usuario.setStatusConta(StatusConta.BANIDA);
        usuarioRepository.save(usuario);

        UsuarioBanido banido = new UsuarioBanido();
        banido.setAdmin(admin);
        banido.setUsuario(usuario);
        banido.setMotivo(motivo);
        banido.setDataBanimento(LocalDate.now());
        banido.setNumeroDocumento(usuario.getNumeroDocumento());
        banido.setEmail(usuario.getEmail());

        usuarioBanidoRepository.save(banido);
    }

    public StatusConta checarStatus(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com o ID: " + id));

        return usuario.getStatusConta();
    }

    // Métodos da interface UserDetails (mantidos conforme estava)
    public Collection<? extends GrantedAuthority> getAuthorities(Usuario usuario) {
        return List.of(new SimpleGrantedAuthority(usuario.getTipoConta().name()));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return "";
    }
}