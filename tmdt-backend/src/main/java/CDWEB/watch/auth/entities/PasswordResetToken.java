package CDWEB.watch.auth.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class PasswordResetToken {
    @Id
    private String token;

    private LocalDateTime expiryDate;

    @OneToOne
    private User user;

    // constructor, getter/setter
}
