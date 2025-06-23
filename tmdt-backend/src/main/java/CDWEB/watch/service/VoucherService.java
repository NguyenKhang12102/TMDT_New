package CDWEB.watch.service;

import CDWEB.watch.auth.entities.User;
import CDWEB.watch.entity.Voucher;
import CDWEB.watch.auth.repositories.UserDetailRepository;
import CDWEB.watch.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private final VoucherRepository voucherRepository;
    private final UserDetailRepository userRepository;

    public Voucher redeemVoucher(User user, int requiredPoints, int discountPercent) {
        if (user.getPoint() < requiredPoints) {
            throw new IllegalArgumentException("Không đủ điểm để đổi voucher.");
        }

        Voucher voucher = Voucher.builder()
                .code(UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .discountPercentage(discountPercent)
                .requiredPoints(requiredPoints)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        user.setPoint(user.getPoint() - requiredPoints);
        userRepository.save(user);
        return voucherRepository.save(voucher);
    }
    public Optional<Voucher> findValidVoucherById(UUID voucherId, UUID userId) {
        return voucherRepository.findByIdAndUserIdAndUsedFalse(voucherId, userId);
    }

    public void markVoucherAsUsed(UUID voucherId) {
        voucherRepository.findById(voucherId).ifPresent(voucher -> {
            voucher.setUsed(true);
            voucherRepository.save(voucher);
        });
    }
}
