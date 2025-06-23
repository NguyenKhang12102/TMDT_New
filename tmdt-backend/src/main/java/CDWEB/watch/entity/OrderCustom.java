package CDWEB.watch.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;
import CDWEB.watch.auth.entities.User;
@Entity
@Table(name = "order_custom")
public class OrderCustom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "request_text", columnDefinition = "TEXT")
    private String requestText;

    private String status = "Tiếp nhận";

    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;


    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getRequestText() { return requestText; }
    public void setRequestText(String requestText) { this.requestText = requestText; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

}
