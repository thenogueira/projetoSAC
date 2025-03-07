package com.apoio_comunitario;

import com.apoio_comunitario.model.Usuario;
import com.apoio_comunitario.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TestUsuario implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public static void main(String[] args) {
        SpringApplication.run(TestUsuario.class, args);
    }

    @Override
    public void run(String... args) {
        try {
            // Tente buscar o usuário pelo nome
            Usuario usuario = usuarioRepository.findByNome("Caioooooo");

            if (usuario != null) {
                System.out.println("Usuário encontrado: " + usuario.getNome());
            } else {
                System.out.println("Usuário não encontrado.");
            }
        } catch (Exception e) {
            System.err.println("Ocorreu um erro: " + e.getMessage());
            e.printStackTrace();
        }
    }
}