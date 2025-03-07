package com.apoio_comunitario.security; // Pacote onde a classe está localizada

import org.springframework.security.config.annotation.web.configurers.LogoutConfigurer; // Importa a classe para configurar logout
import org.springframework.security.web.csrf.CookieCsrfTokenRepository; // Importa a classe para repositório de token CSRF baseado em cookies
import org.springframework.context.annotation.Bean; // Importa a anotação para definir um bean
import org.springframework.context.annotation.Configuration; // Importa a anotação para definir uma classe de configuração
import org.springframework.security.config.annotation.web.builders.HttpSecurity; // Importa a classe para configurar a segurança HTTP
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Importa a classe para codificação de senhas usando BCrypt
import org.springframework.security.crypto.password.PasswordEncoder; // Importa a interface para codificadores de senha
import org.springframework.security.web.SecurityFilterChain; // Importa a classe para a cadeia de filtros de segurança

@Configuration // Indica que esta classe contém configurações do Spring
public class SecurityConfig {

    // Método que configura a cadeia de filtros de segurança
    @Bean // Indica que este método retorna um bean gerenciado pelo Spring
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())) // Configura o repositório de token CSRF para usar cookies
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/public/**").permitAll() // Permite acesso a todos os endpoints que começam com /public
                        .anyRequest().authenticated() // Requer autenticação para qualquer outra requisição
                )
                .formLogin(form -> form
                        .loginPage("/login") // Define a página de login personalizada
                        .permitAll() // Permite acesso à página de login para todos
                )
                .logout(LogoutConfigurer::permitAll); // Permite logout para todos
        return http.build(); // Constrói e retorna a configuração de segurança
    }

    // Método que define o codificador de senhas
    @Bean // Indica que este método retorna um bean gerenciado pelo Spring
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Retorna uma instância de BCryptPasswordEncoder para codificação de senhas
    }
}