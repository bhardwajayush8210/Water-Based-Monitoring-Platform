package com.water.waterbilling.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())

                .authorizeHttpRequests(auth -> auth


                        // =========================
                        // PUBLIC ENDPOINTS
                        // =========================
                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login",
                                "/api/community/register",
                                "/api/invite/**",
                                "/encode"
                        ).permitAll()


                        // =========================
                        // APARTMENTS
                        // =========================
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/apartments/**"
                        ).permitAll()

                        .requestMatchers("/api/apartments/**")
                        .hasRole("ADMIN")


                        // =========================
                        // COMMUNITY ADMIN
                        // =========================
                        .requestMatchers("/api/community/apartment")
                        .hasRole("COMMUNITY_ADMIN")

                        .requestMatchers("/api/community/invite-token")
                        .hasRole("COMMUNITY_ADMIN")

                        .requestMatchers("/api/community/tariff")
                        .hasRole("COMMUNITY_ADMIN")

                        .requestMatchers("/api/community/billing")
                        .hasRole("COMMUNITY_ADMIN")

                        .requestMatchers("/api/community/alerts/**")
                        .hasRole("COMMUNITY_ADMIN")

                        .requestMatchers("/api/community/alert-threshold")
                        .hasRole("COMMUNITY_ADMIN")

                        .requestMatchers("/api/community/water-purchases/**")
                        .hasRole("COMMUNITY_ADMIN")

                        .requestMatchers("/api/community/billing-cycles/**")
                        .hasRole("COMMUNITY_ADMIN")

                        .requestMatchers("/api/community/invoices/**")
                        .hasRole("COMMUNITY_ADMIN")

                        .requestMatchers("/api/community/residents")
                        .hasRole("COMMUNITY_ADMIN")

                        .requestMatchers("/api/community/residents/**")
                        .hasRole("COMMUNITY_ADMIN")

                        .requestMatchers("/api/community/stats")
                        .hasRole("COMMUNITY_ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/community/reports/**")
                        .hasRole("COMMUNITY_ADMIN")


                        // =========================
                        // TICKETS
                        // =========================

                        // Resident creates ticket
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/tickets"
                        )
                        .hasRole("RESIDENT")


                        // Resident views own tickets
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/tickets/my"
                        )
                        .hasRole("RESIDENT")


                        // Community Admin views tickets
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/tickets/community"
                        )
                        .hasRole("COMMUNITY_ADMIN")


                        // Community Admin + Main Admin can update status
                        // (Resolve/Reopen ticket)
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/tickets/*/status"
                        )
                        .hasAnyRole(
                                "COMMUNITY_ADMIN",
                                "ADMIN"
                        )


                        // Only Community Admin forwards to Super Admin
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/tickets/*/escalate"
                        )
                        .permitAll()

                        // Main Admin ticket dashboard
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/tickets/superadmin"
                        )
                        .hasRole("ADMIN")



                        // =========================
                        // RESIDENT
                        // =========================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/usage/comparison/my"
                        )
                        .hasRole("RESIDENT")
                        .requestMatchers("/api/billing/my")
                        .hasRole("RESIDENT")

                        .requestMatchers("/api/alerts/my")
                        .hasRole("RESIDENT")

                        .requestMatchers("/api/notifications/**")
                        .hasRole("RESIDENT")

                        .requestMatchers("/api/invoices/my")
                        .hasRole("RESIDENT")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/usage/my"
                        )
                        .hasRole("RESIDENT")



                        // =========================
                        // COMMUNITY USAGE
                        // =========================
                        .requestMatchers("/api/usage/community/**")
                        .hasRole("COMMUNITY_ADMIN")



                        // =========================
                        // SUPER ADMIN
                        // =========================
                        .requestMatchers("/api/auth/residents")
                        .hasRole("ADMIN")

                        .requestMatchers("/api/auth/residents/**")
                        .hasRole("ADMIN")

                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/admin/reports/**")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/admin/billing-overview/**")
                        .hasRole("ADMIN")

                        // =========================
                        // EVERYTHING ELSE
                        // =========================
                        .anyRequest()
                        .authenticated()

                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}