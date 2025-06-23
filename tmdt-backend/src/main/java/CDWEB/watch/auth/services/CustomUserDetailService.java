package CDWEB.watch.auth.services;

import CDWEB.watch.auth.entities.PasswordResetToken;
import CDWEB.watch.auth.entities.User;
import CDWEB.watch.auth.repositories.PasswordResetTokenRepository;
import CDWEB.watch.auth.repositories.UserDetailRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final UserDetailRepository userDetailRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public CustomUserDetailService(UserDetailRepository userDetailRepository, PasswordResetTokenRepository passwordResetTokenRepository, EmailService emailService, PasswordEncoder passwordEncoder) {
        this.userDetailRepository = userDetailRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userDetailRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));
        return user;
    }

    @Transactional
    public void createPasswordResetToken(String email) {
        User user = userDetailRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email không tồn tại"));

        // Xóa token cũ nếu có
        passwordResetTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(
                token,
                LocalDateTime.now().plusMinutes(15),
                user
        );

        passwordResetTokenRepository.save(resetToken);

        String link = "http://localhost:3000/reset-password?token=" + token;
        emailService.sendEmailPass(email, "Đặt lại mật khẩu", "Nhấn vào link sau để đặt lại mật khẩu: " + link);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Token không hợp lệ"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token đã hết hạn");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userDetailRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);
    }
    public User getUserFromPrincipal(Principal principal) {
        return userDetailRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng"));
    }

}
