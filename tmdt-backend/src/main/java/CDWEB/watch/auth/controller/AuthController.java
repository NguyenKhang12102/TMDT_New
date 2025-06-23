package CDWEB.watch.auth.controller;


import CDWEB.watch.auth.config.JWTTokenHelper;
import CDWEB.watch.auth.dto.LoginRequest;
import CDWEB.watch.auth.dto.RegistrationRequest;
import CDWEB.watch.auth.dto.RegistrationResponse;
import CDWEB.watch.auth.dto.UserToken;
import CDWEB.watch.auth.entities.User;
import CDWEB.watch.auth.services.RegistrationService;
import com.nimbusds.oauth2.sdk.ciba.BackChannelTokenDeliveryMode;
import io.jsonwebtoken.Jwts;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.io.Console;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    RegistrationService registrationService;

    @Autowired
    UserDetailsService userDetailsService;

    @Autowired
    JWTTokenHelper jwtTokenHelper;


    @PostMapping("/login")
    public ResponseEntity<UserToken> login(@RequestBody LoginRequest loginRequest){
        try{
            Authentication authentication= UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.getUserName(),
                    loginRequest.getPassword());

            Authentication authenticationResponse = this.authenticationManager.authenticate(authentication);

            if(authenticationResponse.isAuthenticated()){
                User user= (User) authenticationResponse.getPrincipal();
                if(!user.isEnabled()) {
                    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                }

                String token =jwtTokenHelper.generateToken(user.getEmail());
                UserToken userToken= UserToken.builder().token(token).build();
                return new ResponseEntity<>(userToken,HttpStatus.OK);
            }

        } catch (BadCredentialsException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(@Valid @RequestBody RegistrationRequest request){
        RegistrationResponse registrationResponse = registrationService.createUser(request);

        return new ResponseEntity<>(registrationResponse,
                registrationResponse.getCode() == 200 ? HttpStatus.OK: HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> map) {
        String userName = map.get("userName");
        String code = map.get("code");

        try {
            registrationService.verifyUser(userName, code);
            return ResponseEntity.ok("Xác minh thành công");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");

        try {
            registrationService.resendVerificationCode(email);
            return ResponseEntity.ok("Mã xác minh đã được gửi lại.");
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }


}
