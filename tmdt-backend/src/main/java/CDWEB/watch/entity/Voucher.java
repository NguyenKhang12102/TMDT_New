package CDWEB.watch.entity;

import CDWEB.watch.auth.entities.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "voucher")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voucher {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "discount_percentage", nullable = false)
    private int discountPercentage;

    @Column(name = "required_points", nullable = false)
    private int requiredPoints;

    @Column(nullable = false)
    private boolean used = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Nếu bạn muốn dùng getUsed() thay vì isUsed()
    public boolean getUsed() {
        return used;
    }
}
