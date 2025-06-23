package CDWEB.watch.auth.services;

import CDWEB.watch.auth.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    public String sendMail(User user) {
        String subject = "Xác nhận địa chỉ email";
        String senderName = "TripleD";

        String mailContent = "Xin chào " + user.getUsername() + ",\n\n";
        mailContent += "Cảm ơn bạn đã đăng ký tài khoản tại " + senderName + ".\n";
        mailContent += "Dưới đây là mã xác nhận của bạn: " + user.getVerificationCode() + "\n\n";
        mailContent += "Vui lòng nhập mã này để hoàn tất quá trình xác nhận email.\n\n";
        mailContent += "Trân trọng,\n";
        mailContent += senderName;

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(sender);
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject(subject);
            mailMessage.setText(mailContent);
            javaMailSender.send(mailMessage);
        } catch (Exception e) {
            return "Đã xảy ra lỗi khi gửi email.";
        }

        return "Email đã được gửi thành công.";
    }



}
