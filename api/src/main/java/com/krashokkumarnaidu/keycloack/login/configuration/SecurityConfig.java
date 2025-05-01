package com.krashokkumarnaidu.keycloack.login.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Configuration
@EnableMethodSecurity // Enable @PreAuthorize, @PostAuthorize, etc.
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
                        .requestMatchers("/api/public/**").permitAll()
                        // Protect endpoints that require the manage-account role
                        .requestMatchers("/api/account/**").hasAuthority("ROLE_manage-account")
                        // You can protect other endpoints with different roles
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_admin")
                        // All other requests need authentication
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder())
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                );
        System.out.println("SecurityFilterChain method execution completed");
        return http.build();
    }

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

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter());
        return converter;
    }

    @Bean
    public Converter<Jwt, Collection<GrantedAuthority>> jwtGrantedAuthoritiesConverter() {
        return new Converter<Jwt, Collection<GrantedAuthority>>() {
            @Override
            public Collection<GrantedAuthority> convert(Jwt jwt) {
                Set<String> authorities = new HashSet<>();

                // Extract realm roles
                if (jwt.getClaim("realm_access") != null) {
                    Map<String, Object> realmAccess = jwt.getClaim("realm_access");
                    if (realmAccess.containsKey("roles")) {
                        List<String> roles = (List<String>) realmAccess.get("roles");
                        authorities.addAll(roles);
                    }
                }

                // Extract roles from resource_access.account.roles
                if (jwt.getClaim("resource_access") != null) {
                    Map<String, Object> resourceAccess = jwt.getClaim("resource_access");

                    // Check account roles specifically
                    if (resourceAccess.containsKey("account")) {
                        Map<String, Object> account = (Map<String, Object>) resourceAccess.get("account");
                        if (account.containsKey("roles")) {
                            List<String> roles = (List<String>) account.get("roles");
                            authorities.addAll(roles);
                        }
                    }

                    // You can also extract roles from specific clients
                    if (resourceAccess.containsKey("react-demo")) {
                        Map<String, Object> client = (Map<String, Object>) resourceAccess.get("react-demo");
                        if (client.containsKey("roles")) {
                            List<String> roles = (List<String>) client.get("roles");
                            authorities.addAll(roles);
                        }
                    }
                }

                // Convert all roles to authorities with ROLE_ prefix
                return authorities.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(Collectors.toList());
            }
        };
    }
}