package CDWEB.watch.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

import java.nio.file.*;
import java.util.Map; // thêm import này

@RestController
@RequestMapping("/api/file")
public class FileUpload {

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Chưa chọn file"));

        try {
            // Tạo thư mục uploads nếu chưa có
            String uploadsDir = "uploads/";
            Files.createDirectories(Paths.get(uploadsDir));

            // Tạo tên file không trùng
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadsDir + fileName);
            file.transferTo(filePath);

            // Trả về JSON có trường url
            String url = "/uploads/" + fileName;
            return ResponseEntity.ok().body(Map.of("url", url));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}
