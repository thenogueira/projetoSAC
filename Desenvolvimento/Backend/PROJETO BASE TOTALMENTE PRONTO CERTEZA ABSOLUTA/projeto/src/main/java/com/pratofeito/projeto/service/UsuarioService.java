package com.pratofeito.projeto.service;

import com.pratofeito.projeto.model.Usuario;
import com.pratofeito.projeto.model.enums.TipoDocumento;
import com.pratofeito.projeto.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

/**
 * Serviço responsável por implementar a lógica de negócio relacionada à entidade Usuario.
 * Esta classe faz a intermediação entre o controlador (Controller) e o repositório (Repository),
 * garantindo que as regras de negócio sejam aplicadas antes de persistir ou recuperar dados.
 */
@Service // Indica que esta classe é um serviço gerenciado pelo Spring
public class UsuarioService implements UserDetails {

    @Autowired // Injeção de dependência automática do repositório UsuarioRepository
    private UsuarioRepository usuarioRepository;

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
}