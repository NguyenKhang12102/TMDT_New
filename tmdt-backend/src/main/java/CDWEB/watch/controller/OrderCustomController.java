package CDWEB.watch.controller;

import CDWEB.watch.entity.OrderCustom;
import CDWEB.watch.repository.OrderCustomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;
import java.security.Principal;
import java.io.File;
import CDWEB.watch.auth.repositories.UserDetailRepository;
import CDWEB.watch.auth.entities.User;
import java.util.*;

@RestController
@RequestMapping("/api/order-custom")
@CrossOrigin(origins = "*", exposedHeaders = "Content-Range")
public class OrderCustomController {

    @Autowired
    private OrderCustomRepository repository;
    @Autowired
    private UserDetailRepository userDetailRepository;

    private static final String UPLOAD_DIR = "uploads";
    @Autowired
    private OrderCustomRepository orderCustomRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("requestText") String requestText,
            Principal principal
    ) {
        try {
            String originalFilename = file.getOriginalFilename();
            String uploadDirPath = System.getProperty("user.dir") + File.separator + "uploads";
            File uploadDir = new File(uploadDirPath);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            String timestampedName = System.currentTimeMillis() + "_" + originalFilename;
            File savedFile = new File(uploadDir, timestampedName);
            file.transferTo(savedFile);

            String relativeUrl = "/uploads/" + timestampedName;

            OrderCustom order = new OrderCustom();
            order.setFilename(originalFilename);
            order.setFileUrl(relativeUrl);
            order.setRequestText(requestText);
            order.setStatus("Đang xử lí");

            // ✅ Gán user nếu có
            if (principal != null) {
                String email = principal.getName();
                Optional<User> userOpt = userDetailRepository.findByEmail(email);
                userOpt.ifPresent(order::setUser);
            }

            repository.save(order);

            return ResponseEntity.ok(Map.of("url", relativeUrl));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi server: " + e.getMessage()));
        }
    }



    @GetMapping
    public ResponseEntity<List<OrderCustom>> getAllOrders() {
        List<OrderCustom> list = repository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        return ResponseEntity.ok()
                .header("Content-Range", "order-custom 0-" + (list.size() - 1) + "/" + list.size())
                .body(list);
    }



    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<OrderCustom> optional = repository.findById(id);
        if (optional.isPresent()) {
            OrderCustom order = optional.get();
            order.setStatus(body.get("status"));
            repository.save(order);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/my-customorder")
    public ResponseEntity<List<OrderCustom>> getMyOrders(Principal principal) {
        String email = principal.getName();
        List<OrderCustom> orders = repository.findByUserEmail(email);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderCustom> getOrderCustomById(@PathVariable Long id) {
        Optional<OrderCustom> order = repository.findById(id);
        return order.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



}
