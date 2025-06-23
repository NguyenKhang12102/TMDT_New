package CDWEB.watch.repository;

import CDWEB.watch.entity.OrderCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderCustomRepository extends JpaRepository<OrderCustom, Long> {
    List<OrderCustom> findByUserEmail(String email);

}