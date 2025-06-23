package CDWEB.watch.auth.services;


import CDWEB.watch.auth.dto.RegistrationRequest;
import CDWEB.watch.auth.dto.RegistrationResponse;
import CDWEB.watch.auth.entities.User;
import CDWEB.watch.auth.helper.VerificationCodeGenerator;
import CDWEB.watch.auth.repositories.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerErrorException;

import java.time.Duration;
import java.time.LocalDateTime;

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

        User existing = userDetailRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Email không tồn tại"));


        if (existing != null && existing.isEnabled()) {
            return RegistrationResponse.builder()
                    .code(400)
                    .message("Email đã được sử dụng!")
                    .build();

        }

        try {
            User user;

            if (existing != null && !existing.isEnabled()) {
                // Nếu user đã tồn tại nhưng chưa xác thực -> cập nhật lại mã xác minh
                user = existing;
                user.setFirstName(request.getFirstName());
                user.setLastName(request.getLastName());
                user.setPhoneNumber(request.getPhoneNumber());
                user.setDateOfBirth(request.getDateOfBirth());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            } else {
                user = new User();
                user.setFirstName(request.getFirstName());
                user.setLastName(request.getLastName());
                user.setEmail(request.getEmail());
                user.setPhoneNumber(request.getPhoneNumber());
                user.setDateOfBirth(request.getDateOfBirth());
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user.setProvider("manual");
                user.setEnabled(false);
                user.setAuthorities(authorityService.getUserAuthority());
            }

            String code = VerificationCodeGenerator.generateCode();
            user.setVerificationCode(code);
            user.setVerificationCodeCreatedAt(LocalDateTime.now());

            userDetailRepository.save(user);
            emailService.sendMail(user);

            return RegistrationResponse.builder()
                    .code(200)
                    .message("Mã xác minh đã được gửi lại!")
                    .build();

        } catch (Exception e) {
            throw new ServerErrorException("Đăng ký thất bại", e);
        }

    }

    public void verifyUser(String userName, String inputCode) {
        User user = userDetailRepository.findByEmail(userName)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + userName));

        if (user == null) {
            throw new RuntimeException("Người dùng không tồn tại");
        }

        if (!user.getVerificationCode().equals(inputCode)) {
            throw new RuntimeException("Mã xác minh không đúng");
        }

        LocalDateTime createdAt = user.getVerificationCodeCreatedAt();
        if (createdAt == null ||
                java.time.Duration.between(createdAt, LocalDateTime.now()).toMinutes() > 3) {
            throw new RuntimeException("Mã xác minh đã hết hạn");
        }

        user.setEnabled(true);
        user.setVerificationCode(null);
        user.setVerificationCodeCreatedAt(null); // Xoá timestamp sau khi xác minh
        userDetailRepository.save(user);
    }

    public void resendVerificationCode(String email) {
        User user = userDetailRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email không tồn tại"));

        if (user == null) {
            throw new RuntimeException("Email không tồn tại");
        }

        if (user.isEnabled()) {
            throw new RuntimeException("Tài khoản đã được xác minh");
        }

        LocalDateTime lastSent = user.getVerificationCodeCreatedAt();
        if (lastSent != null && Duration.between(lastSent, LocalDateTime.now()).toMinutes() < 3) {
            long wait = 3 - Duration.between(lastSent, LocalDateTime.now()).toMinutes();
            throw new RuntimeException("Vui lòng chờ " + wait + " phút trước khi gửi lại mã xác minh");
        }

        String newCode = VerificationCodeGenerator.generateCode();
        user.setVerificationCode(newCode);
        user.setVerificationCodeCreatedAt(LocalDateTime.now());
        userDetailRepository.save(user);

        emailService.sendMail(user);
    }


}
