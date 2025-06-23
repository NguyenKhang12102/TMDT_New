package CDWEB.watch.auth.services;

import CDWEB.watch.auth.dto.RegistrationRequest;
import CDWEB.watch.auth.dto.RegistrationResponse;
import CDWEB.watch.auth.entities.User;
import CDWEB.watch.auth.helper.VerificationCodeGenerator;
import CDWEB.watch.auth.repositories.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerErrorException;

import java.util.Optional;

@Service
public class RegistrationService {

    @Autowired
    private UserDetailRepository userDetailRepository;

    @Autowired
    private AuthorityService authorityService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public RegistrationResponse createUser(RegistrationRequest request) {

        Optional<User> existing = userDetailRepository.findByEmail(request.getEmail());

        if (existing.isPresent()) {
            return RegistrationResponse.builder()
                    .code(400)
                    .message("Email đã tồn tại!")
                    .build();
        }

        try {
            User user = new User();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setEnabled(false);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setProvider("manual");

            String code = VerificationCodeGenerator.generateCode();
            user.setVerificationCode(code);
            user.setAuthorities(authorityService.getUserAuthority());

            userDetailRepository.save(user);
            emailService.sendMail(user);

            return RegistrationResponse.builder()
                    .code(200)
                    .message("Tạo tài khoản thành công!")
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            throw new ServerErrorException(e.getMessage(), e.getCause());
        }
    }

    public void verifyUser(String email) {
        Optional<User> userOpt = userDetailRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEnabled(true);
            userDetailRepository.save(user);
        }
    }
}
