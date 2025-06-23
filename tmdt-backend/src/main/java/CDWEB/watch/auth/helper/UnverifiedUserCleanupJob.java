package CDWEB.watch.auth.helper;

import CDWEB.watch.auth.entities.User;
import CDWEB.watch.auth.repositories.UserDetailRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class UnverifiedUserCleanupJob {

    @Autowired
    private UserDetailRepository userDetailRepository;

    // Chạy mỗi 1 giờ (cron biểu thức: giây, phút, giờ, ngày, tháng, thứ)
    @Scheduled(cron = "0 */30 * * * *") // chạy mỗi phút
    @Transactional
    public void removeUnverifiedUsers() {
        List<User> unverifiedUsers = userDetailRepository.findByEnabledFalse();

        for (User user : unverifiedUsers) {
            LocalDateTime createdAt = user.getVerificationCodeCreatedAt();

            if (createdAt != null) {
                long minutes = Duration.between(createdAt, LocalDateTime.now()).toMinutes();
                System.out.println("🕒 " + user.getEmail() + " - " + minutes + " phút đã qua");

                if (minutes > 60) {
                    userDetailRepository.delete(user);
                    System.out.println("🗑️ Đã xóa user chưa xác thực: " + user.getEmail());
                }
            }
        }
    }

}
