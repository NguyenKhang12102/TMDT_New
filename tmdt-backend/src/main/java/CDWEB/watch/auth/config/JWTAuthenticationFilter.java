package CDWEB.watch.auth.config;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JWTAuthenticationFilter.class);

    private final UserDetailsService userDetailsService;
    private final JWTTokenHelper jwtTokenHelper;

    public JWTAuthenticationFilter(JWTTokenHelper jwtTokenHelper,UserDetailsService userDetailsService) {
        this.jwtTokenHelper = jwtTokenHelper;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if(null == authHeader || !authHeader.startsWith("Bearer ")){
            logger.debug("No Bearer token found or malformed header. Proceeding without authentication for JWT filter.");
            filterChain.doFilter(request,response);
            return;
        }

        try {
            String authToken = jwtTokenHelper.getToken(request);
            if(null != authToken){
                String userName = jwtTokenHelper.getUserNameFromToken(authToken);
                if(null != userName){
                    UserDetails userDetails= userDetailsService.loadUserByUsername(userName);

                    if(jwtTokenHelper.validateToken(authToken,userDetails)) {
                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authenticationToken.setDetails(new WebAuthenticationDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                        logger.info("Successfully authenticated user: {}", userName);
                    } else {
                        logger.warn("JWT Token validation failed for user: {}", userName);
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Invalid JWT token.\"}");
                        return;
                    }
                } else {
                    logger.warn("Username could not be extracted from JWT token.");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Invalid JWT token: Username not found.\"}");
                    return;
                }
            } else {
                logger.warn("Auth token is null after extraction.");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"JWT token is null.\"}");
                return;
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            logger.error("Error during JWT authentication: {}", e.getMessage(), e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Authentication failed: " + e.getMessage() + "\"}");
        }
    }
}
