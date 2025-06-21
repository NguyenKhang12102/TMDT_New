package CDWEB.watch.repository;

import CDWEB.watch.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByProductIdOrderByCreatedAtDesc(UUID productId);
}

