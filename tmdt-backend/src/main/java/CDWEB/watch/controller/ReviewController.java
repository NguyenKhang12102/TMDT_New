package CDWEB.watch.controller;

import CDWEB.watch.entity.Review;
import CDWEB.watch.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép frontend truy cập (nếu khác domain)
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepo;

    // API: Lấy danh sách đánh giá theo productId, sắp xếp theo createdAt giảm dần
    @GetMapping
    public List<Review> getReviewsByProduct(@PathVariable("productId") UUID productId) {
        System.out.println("GET Reviews for productId: " + productId);
        List<Review> reviews = reviewRepo.findByProductIdOrderByCreatedAtDesc(productId);
        System.out.println("Found " + reviews.size() + " reviews");
        return reviews;
    }

    // API: Thêm đánh giá mới cho productId
    @PostMapping
    public Review createReview(@PathVariable UUID productId, @RequestBody Review review) {
        review.setProductId(productId); // Set productId từ path param
        review.setCreatedAt(LocalDateTime.now()); // Set thời gian hiện tại

        // Nếu id chưa có thì Hibernate tự sinh UUID khi lưu (nếu @GeneratedValue đúng cấu hình)
        // Nếu muốn tự sinh UUID thủ công, có thể: review.setId(UUID.randomUUID());

        return reviewRepo.save(review);
    }
}
