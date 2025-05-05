package com.pratofeito.projeto.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.LogoutConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

/**
 * Classe de configuração de segurança do Spring Security.
 * Define as regras de autenticação, autorização e proteção contra CSRF.
 */
@Configuration // Indica que esta classe é uma classe de configuração do Spring
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    SecurityFilter securityFilter;

    /**
     * Configura a cadeia de filtros de segurança (SecurityFilterChain).
     * Define as regras de autorização, proteção CSRF, login e logout.
     *
     * param http Objeto HttpSecurity usado para configurar as regras de segurança.
     * return SecurityFilterChain configurado.
     * throws Exception Se ocorrer um erro durante a configuração.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable()) // Desabilita completamente CSRF
                .cors(cors -> cors.disable()) // Desabilita CORS temporariamente para testes
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/usuarios/banir/**").hasRole("ADMINISTRADOR")
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/usuarios/atualizar/**").permitAll()
                        .requestMatchers("/usuarios/deletar/**").permitAll()// Liberação explícita
                        .requestMatchers(HttpMethod.GET, "/usuarios/listar").hasRole("ADMINISTRADOR")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

}