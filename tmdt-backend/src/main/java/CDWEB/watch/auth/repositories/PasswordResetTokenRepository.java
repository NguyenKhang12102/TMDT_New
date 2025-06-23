package CDWEB.watch.auth.repositories;

import CDWEB.watch.auth.entities.PasswordResetToken;
import CDWEB.watch.auth.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {
    Optional<PasswordResetToken> findByToken(String token);

    void deleteByUser(User user);
}
