package com.krashokkumarnaidu.keycloack.login.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("SecurityFilterChain method execution started");
        http
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration configuration = new CorsConfiguration();
                    // Replace the wildcard with specific origins
                    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000","http://localhost:5173"));
                    // Specify allowed methods instead of wildcard
                    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    // Specify allowed headers instead of wildcard
                    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
                    configuration.setAllowCredentials(true);
                    return configuration;
                }))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/public").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder())
                        )
                );
        System.out.println("SecurityFilterChain method execution completed");
        return http.build();
    }

//    @Bean
//    public JwtDecoder jwtDecoder() {
//        System.out.println("jwtDecoder method execution started");
//        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri("http://localhost:8080/realms/react-apps/protocol/openid-connect/certs").build();
//
//        OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer("http://localhost:8080/realms/react-apps");
//
//        OAuth2TokenValidator<Jwt> audienceValidator =
//                new JwtClaimValidator<List<String>>("aud", aud -> aud != null && aud.contains("account"));
//
//        OAuth2TokenValidator<Jwt> validator = new DelegatingOAuth2TokenValidator<>(withIssuer, audienceValidator);
//
//        jwtDecoder.setJwtValidator(validator);
//        System.out.println("jwtDecoder method execution completed");
//        return jwtDecoder;
//    }
@Bean
public JwtDecoder jwtDecoder() {
    NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri(
            "http://localhost:8080/realms/react-apps/protocol/openid-connect/certs"
    ).build();

    // Validate issuer
    OAuth2TokenValidator<Jwt> withIssuer =
            JwtValidators.createDefaultWithIssuer("http://localhost:8080/realms/react-apps");

    // Validate client ID via azp claim
    OAuth2TokenValidator<Jwt> clientIdValidator =
            new JwtClaimValidator<String>("azp", azp -> "react-demo".equals(azp));

    // Combine validators
    OAuth2TokenValidator<Jwt> validator =
            new DelegatingOAuth2TokenValidator<>(withIssuer, clientIdValidator);

    jwtDecoder.setJwtValidator(validator);
    return jwtDecoder;
}

}