package CDWEB.watch.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")  // map UUID sang binary(16)
    private UUID id;

    @Column(nullable = false)
    private String content;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "user_id", columnDefinition = "BINARY(16)")
    private UUID userId;

    @Column(name = "product_id", nullable = false, columnDefinition = "BINARY(16)")
    private UUID productId;



    // Tự động set createdAt khi persist entity mới
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
