package CDWEB.watch.auth.controller;


import CDWEB.watch.auth.dto.ChangePasswordRequest;
import CDWEB.watch.auth.dto.ResetPasswordRequest;
import CDWEB.watch.auth.dto.UserDetailsDto;
import CDWEB.watch.auth.entities.User;
import CDWEB.watch.auth.repositories.UserDetailRepository;
import CDWEB.watch.auth.services.CustomUserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/api/user")
public class UserDetailController {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserDetailRepository userRepository;
    @Autowired
    private CustomUserDetailService customUserDetailService;


    @GetMapping("/profile")
    public ResponseEntity<UserDetailsDto> getUserProfile(Principal principal){
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());

        if(null == user){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        UserDetailsDto userDetailsDto = UserDetailsDto.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .id(user.getId())
                .phoneNumber(user.getPhoneNumber())
                .points(user.getPoint())
                .addressList(user.getAddressList())
                .authorityList(user.getAuthorities().toArray()).build();

        return new ResponseEntity<>(userDetailsDto, HttpStatus.OK);

    }
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        String contentRange = "users 0-" + (users.size() - 1) + "/" + users.size();
        return ResponseEntity.ok()
                .header("Content-Range", contentRange)
                .body(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") UUID id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") UUID id, @RequestBody User update) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        // Cập nhật các trường cho phép
        user.setFirstName(update.getFirstName());
        user.setLastName(update.getLastName());
        user.setEmail(update.getEmail());
        user.setPhoneNumber(update.getPhoneNumber());
        // ... các trường khác nếu cần
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> disableUser(@PathVariable("id") UUID id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        user.setEnabled(false);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(Principal principal,
                                            @RequestBody ChangePasswordRequest request) {
        // Lấy thông tin user từ token (principal)
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        // Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Old password is incorrect");
        }

        // Mã hoá và cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        try {
            customUserDetailService.createPasswordResetToken(email);
            return ResponseEntity.ok("Đã gửi email đặt lại mật khẩu");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    /**
     * Đặt lại mật khẩu mới bằng token hợp lệ.
     * @param request Chứa token và mật khẩu mới.
     * @return Trả về thông báo kết quả đặt lại mật khẩu.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            customUserDetailService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok("Đổi mật khẩu thành công");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



}
