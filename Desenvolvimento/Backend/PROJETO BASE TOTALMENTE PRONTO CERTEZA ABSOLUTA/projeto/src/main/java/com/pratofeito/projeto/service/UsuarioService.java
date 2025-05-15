package com.pratofeito.projeto.service;

import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.model.UsuarioBanido;
import com.pratofeito.projeto.model.enums.StatusConta;
import com.pratofeito.projeto.model.enums.TipoConta;
import com.pratofeito.projeto.model.enums.TipoDocumento;
import com.pratofeito.projeto.repository.UsuarioBanidoRepository;
import com.pratofeito.projeto.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

/**
 * Serviço responsável por implementar a lógica de negócio relacionada à entidade Usuario.
 * Esta classe faz a intermediação entre o controlador (Controller) e o repositório (Repository),
 * garantindo que as regras de negócio sejam aplicadas antes de persistir ou recuperar dados.
 */
@Service // Indica que esta classe é um serviço gerenciado pelo Spring
public class UsuarioService implements UserDetails {

    @Autowired // Injeção de dependência automática do repositório UsuarioRepository
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioBanidoRepository usuarioBanidoRepository;

    /**
     * Retorna uma lista de todos os usuários cadastrados no sistema.
     *
     * return Lista de objetos Usuario contendo todos os usuários cadastrados.
     */
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll(); // Chama o método do repositório para obter todos os usuários
    }

    /**
     * Salva um novo usuário no banco de dados, aplicando validações necessárias.
     *
     * param usuario Objeto Usuario a ser salvo.
     * return O usuário salvo, incluindo seu ID gerado.
     * throws IllegalArgumentException Se o documento do usuário não estiver de acordo com as regras de validação.
     */
    public Usuario salvarUsuario(Usuario usuario) {
        this.validarDocumento(usuario); // Valida o documento antes de salvar
        return usuarioRepository.save(usuario); // Chama o método do repositório para salvar o usuário
    }

    /**
     * Valida o documento do usuário com base no tipo de documento (CPF ou CNPJ).
     *
     * param usuario Objeto Usuario cujo documento será validado.
     * throws IllegalArgumentException Se o documento não atender aos requisitos de tamanho para CPF ou CNPJ.
     */
    private void validarDocumento(Usuario usuario) {
        String numeroDocumento = usuario.getNumeroDocumento(); // Obtém o número do documento do usuário
        TipoDocumento tipoDocumento = usuario.getTipoDocumento(); // Obtém o tipo de documento (CPF ou CNPJ)

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
     * Retorna as autoridades (papéis) do usuário.
     * Utilizado pelo Spring Security para controle de acesso.
     *
     * return Uma lista de autoridades (papéis) do usuário.
     */


    public Collection<? extends GrantedAuthority> getAuthorities(Usuario usuario) {
        return List.of(new SimpleGrantedAuthority(usuario.getTipoConta().name())); // Converte o tipo de conta em uma autoridade do Spring Security
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

    @Transactional
    public Usuario atualizarUsuario(Integer id, Usuario usuarioAtualizado) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        // Atualiza apenas os campos permitidos
        usuarioExistente.setNome(usuarioAtualizado.getNome());
        usuarioExistente.setEmail(usuarioAtualizado.getEmail());


        return usuarioRepository.save(usuarioExistente);
    }

    public Usuario buscarUsuarioPorId(Integer id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public void deletarUsuario(Integer id) {
        usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com o ID: " + id));
        usuarioRepository.deleteById(id);
    }

    @Transactional
    public void banirUsuario(Integer usuarioId, Integer adminId, String motivo) {
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

    public StatusConta checarStatus(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com o ID: " + id));

        return usuario.getStatusConta();
    }

    @Transactional
    public void banirConta(Integer usuarioId, Integer adminId, String motivo) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        // Impede que administradores sejam banidos
        if (usuario.getTipoConta() == TipoConta.ADMINISTRADOR) {
            throw new IllegalStateException("Não é possível banir outro administrador");
        }

        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new EntityNotFoundException("Administrador não encontrado"));

        // Atualiza status
        usuario.setStatusConta(StatusConta.BANIDA);
        usuarioRepository.save(usuario);

        // Registra o banimento
        UsuarioBanido banido = new UsuarioBanido();
        banido.setAdmin(admin);
        banido.setUsuario(usuario);
        banido.setMotivo(motivo);
        banido.setDataBanimento(LocalDate.now());
        banido.setNumeroDocumento(usuario.getNumeroDocumento());
        banido.setEmail(usuario.getEmail());

        usuarioBanidoRepository.save(banido);
    }

}