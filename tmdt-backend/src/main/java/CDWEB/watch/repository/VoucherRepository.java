package CDWEB.watch.repository;
import java.util.List;
import CDWEB.watch.entity.Voucher;
import CDWEB.watch.auth.entities.User;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
public interface VoucherRepository extends JpaRepository<Voucher, UUID> {
    List<Voucher> findByUserAndUsedFalse(User user);

    Optional<Voucher> findByCodeAndUserId(String code, UUID userId);

    Optional<Voucher> findByIdAndUserIdAndUsedFalse(UUID id, UUID userId);
}
