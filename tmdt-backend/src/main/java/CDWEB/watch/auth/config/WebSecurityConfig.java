package CDWEB.watch.auth.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;



    @Autowired
    private JWTTokenHelper jwtTokenHelper;

    private static final String[] publicApis= {
            "/api/auth/**"
    };

    private static final String[] adminApis = {
            "/api/admin/**"
    };

    @Bean
    @Order(1)
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        RequestMatcher apiRequestMatcher = new AntPathRequestMatcher("/api/**");

        http
                .securityMatcher(apiRequestMatcher)
                .cors(cors -> {})
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(publicApis).permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/category/**", "/api/order", "/api/category-types","/api/products/by-category-type/**").permitAll()                     
                        .requestMatchers(HttpMethod.POST, "/api/products/**", "/api/category/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/products/**", "/api/category/**").permitAll()
                        .requestMatchers("/api/order/**").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Access Denied. Please ensure you have a valid JWT token.\"}");
                        })
                )
                .addFilterBefore(new JWTAuthenticationFilter(jwtTokenHelper, userDetailsService), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {})
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("/oauth2/success")
                        .loginPage("/oauth2/authorization/google")
                )
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendRedirect("/oauth2/authorization/google");
                        })
                );

        return http.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer(){
        return (web) -> web.ignoring().requestMatchers(publicApis);
    }

    @Bean
    public AuthenticationManager authenticationManager(){
        DaoAuthenticationProvider daoAuthenticationProvider= new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());

        return new ProviderManager(daoAuthenticationProvider);

    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of(
                "*",
                "Authorization",
                "Content-Type",
                "X-Requested-With"
        ));
        config.setExposedHeaders(List.of("Content-Range", "Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
