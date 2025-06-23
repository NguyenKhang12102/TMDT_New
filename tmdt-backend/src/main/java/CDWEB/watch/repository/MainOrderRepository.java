package CDWEB.watch.repository;

import CDWEB.watch.entity.Order;
import CDWEB.watch.entity.OrderStatus;
import CDWEB.watch.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MainOrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByPayment_PaymentStatus(PaymentStatus paymentStatus);
    List<Order> findByPayment_PaymentStatusAndPayment_PaymentDateBetween(PaymentStatus paymentStatus, LocalDateTime start, LocalDateTime end);

    List<Order> findByOrderStatus(OrderStatus orderStatus);
    List<Order> findByOrderStatusAndOrderDateBetween(OrderStatus orderStatus, LocalDateTime start, LocalDateTime end);
} 