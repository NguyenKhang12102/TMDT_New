package CDWEB.watch.controller;

import CDWEB.watch.auth.entities.User;
import CDWEB.watch.auth.services.CustomUserDetailService;
import CDWEB.watch.entity.Voucher;
import CDWEB.watch.repository.VoucherRepository;
import CDWEB.watch.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;
    private final CustomUserDetailService userDetailService;
    private final VoucherRepository voucherRepository;

    // Đổi điểm lấy mã giảm giá
    @PostMapping("/redeem")
    public ResponseEntity<?> redeemVoucher(@RequestParam int points, Principal principal) {
        User user = (User) userDetailService.loadUserByUsername(principal.getName());

        int discount;
        if (points == 500) {
            discount = 10;
        } else if (points == 1000) {
            discount = 20;
        } else {
            return ResponseEntity.badRequest().body("Chỉ chấp nhận đổi 500 hoặc 1000 điểm.");
        }

        if (user.getPoint() < points) {
            return ResponseEntity.badRequest().body("Bạn không đủ điểm để đổi voucher này.");
        }


        Voucher voucher = voucherService.redeemVoucher(user, points, discount);
        return ResponseEntity.ok(Map.of(
                "voucherId", voucher.getId(),
                "code", voucher.getCode(),                        // thêm dòng này
                "discountPercentage", voucher.getDiscountPercentage()
        ));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyVoucher(
            @RequestParam String code,
            @RequestParam UUID userId
    ) {
        Optional<Voucher> optionalVoucher = voucherRepository.findByCodeAndUserId(code, userId);

        if (optionalVoucher.isEmpty()) {
            return ResponseEntity.badRequest().body("Mã không hợp lệ.");
        }

        Voucher voucher = optionalVoucher.get();

        if (Boolean.TRUE.equals(voucher.getUsed())) {
            return ResponseEntity.badRequest().body("Voucher đã được sử dụng.");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("discountPercentage", voucher.getDiscountPercentage());
        result.put("voucherId", voucher.getId());
        return ResponseEntity.ok(result);
    }

}
