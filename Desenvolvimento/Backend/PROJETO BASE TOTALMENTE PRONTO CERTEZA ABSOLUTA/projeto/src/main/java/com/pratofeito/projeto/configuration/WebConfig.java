package com.pratofeito.projeto.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Classe de configuração para o Spring MVC.
 * Esta classe implementa a interface WebMvcConfigurer para personalizar a configuração do MVC.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configura as regras de CORS (Cross-Origin Resource Sharing) para a aplicação.
     *
     * @param registry O registro de CORS que permite a configuração das regras de acesso.
     *                 Neste caso, permite requisições de qualquer origem e para todos os métodos HTTP.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permite acesso a todos os endpoints da aplicação.
                .allowedOrigins("*") // Permite requisições de qualquer origem.
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Permite os métodos HTTP especificados.
                .allowedHeaders("*"); // Permite todos os cabeçalhos nas requisições.
    }
}
