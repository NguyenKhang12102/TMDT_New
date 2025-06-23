package CDWEB.watch.service;

import CDWEB.watch.auth.dto.OrderResponse;
import CDWEB.watch.auth.entities.User;
import CDWEB.watch.auth.repositories.OrderRepository;
import CDWEB.watch.auth.repositories.UserDetailRepository;
import CDWEB.watch.dto.OrderDetails;
import CDWEB.watch.dto.OrderItemDetail;
import CDWEB.watch.dto.OrderRequest;
import CDWEB.watch.entity.*;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.*;

@Service
public class OrderService {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    ProductService productService;

    @Autowired
    PaymentIntentService paymentIntentService;

    @Autowired
    private UserDetailRepository userDetailRepository;

    @Autowired
    private VoucherService voucherService;

    public List<OrderDetails> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(order -> OrderDetails.builder()
                .id(order.getId())
                .orderDate(order.getOrderDate())
                .orderStatus(order.getOrderStatus())
                .shipmentNumber(order.getShipmentTrackingNumber())
                .address(order.getAddress())
                .totalAmount(order.getTotalAmount())
                .orderItemList(getItemDetails(order.getOrderItemList()))
                .expectedDeliveryDate(order.getExpectedDeliveryDate())
                .build()
        ).toList();
    }

    public OrderDetails getOrderById(UUID id) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) return null;
        return OrderDetails.builder()
                .id(order.getId())
                .orderDate(order.getOrderDate())
                .orderStatus(order.getOrderStatus())
                .shipmentNumber(order.getShipmentTrackingNumber())
                .address(order.getAddress())
                .totalAmount(order.getTotalAmount())
                .orderItemList(getItemDetails(order.getOrderItemList()))
                .expectedDeliveryDate(order.getExpectedDeliveryDate())
                .build();
    }

    @Transactional
    public OrderResponse createOrder(OrderRequest orderRequest, Principal principal) throws Exception {

        User user = (User) userDetailsService.loadUserByUsername(principal.getName());
        Address address = user.getAddressList().stream()
                .filter(addr -> orderRequest.getAddressId().equals(addr.getId()))
                .findFirst()
                .orElseThrow(BadRequestException::new);

        double discountPercent = 0.0;
        double discountAmount = 0.0;

        // Nếu có mã giảm giá, lấy phần trăm và kiểm tra hợp lệ
        if (orderRequest.getVoucherId() != null) {
            Voucher voucher = voucherService.findValidVoucherById(orderRequest.getVoucherId(), user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Voucher không hợp lệ hoặc đã sử dụng"));

            discountPercent = voucher.getDiscountPercentage();
            discountAmount = orderRequest.getTotalAmount() * (discountPercent / 100.0);

            // ✅ Đánh dấu voucher đã dùng
            voucherService.markVoucherAsUsed(voucher.getId());
        }

        double finalTotal = orderRequest.getTotalAmount() - discountAmount;
        orderRequest.setTotalAmount(finalTotal); // ✅ Cập nhật lại giá trị tổng sau giảm giá

        Order order = Order.builder()
                .user(user)
                .address(address)
                .totalAmount(finalTotal)
                .discount(discountPercent)
                .discountAmount(discountAmount)
                .orderDate(orderRequest.getOrderDate())
                .expectedDeliveryDate(orderRequest.getExpectedDeliveryDate())
                .paymentMethod(orderRequest.getPaymentMethod())
                .orderStatus(OrderStatus.PENDING)
                .build();

        List<OrderItem> orderItems = orderRequest.getOrderItemRequests().stream().map(itemReq -> {
            try {
                Product product = productService.fetchProductById(itemReq.getProductId());
                return OrderItem.builder()
                        .product(product)
                        .productVariantId(itemReq.getProductVariantId())
                        .quantity(itemReq.getQuantity())
                        .order(order)
                        .build();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).toList();

        order.setOrderItemList(orderItems);

        Payment payment = new Payment();
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setPaymentDate(new Date());
        payment.setOrder(order);
        payment.setAmount(finalTotal);
        payment.setPaymentMethod(order.getPaymentMethod());
        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        // ✅ Tặng điểm cho người dùng
        user.setPoint(user.getPoint() + 100);
        userDetailRepository.save(user);

        return OrderResponse.builder()
                .orderId(savedOrder.getId())
                .paymentMethod(order.getPaymentMethod())
                .credentials(
                        "CARD".equals(order.getPaymentMethod())
                                ? paymentIntentService.createPaymentIntent(order)
                                : null
                )
                .build();
    }


    public Map<String,String> updateStatus(String paymentIntentId, String status) throws BadRequestException {

        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            if (paymentIntent != null && paymentIntent.getStatus().equals("succeeded")) {
                String orderId = paymentIntent.getMetadata().get("orderId");
                Order order = orderRepository.findById(UUID.fromString(orderId)).orElseThrow(BadRequestException::new);
                Payment payment = order.getPayment();
                payment.setPaymentStatus(PaymentStatus.COMPLETED);
                payment.setPaymentMethod(paymentIntent.getPaymentMethod());
                order.setPaymentMethod(paymentIntent.getPaymentMethod());
                order.setOrderStatus(OrderStatus.IN_PROGRESS);
                order.setPayment(payment);
                Order savedOrder = orderRepository.save(order);
                Map<String, String> map = new HashMap<>();
                map.put("orderId", String.valueOf(savedOrder.getId()));
                return map;
            } else {
                throw new IllegalArgumentException("PaymentIntent not found or missing metadata");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("PaymentIntent not found or missing metadata");
        }
    }

    public List<OrderDetails> getOrdersByUser(String name) {
        User user = (User) userDetailsService.loadUserByUsername(name);
        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream().map(order -> {
            return OrderDetails.builder()
                    .id(order.getId())
                    .orderDate(order.getOrderDate())
                    .orderStatus(order.getOrderStatus())
                    .shipmentNumber(order.getShipmentTrackingNumber())
                    .address(order.getAddress())
                    .totalAmount(order.getTotalAmount())
                    .orderItemList(getItemDetails(order.getOrderItemList()))
                    .expectedDeliveryDate(order.getExpectedDeliveryDate())
                    .build();
        }).toList();
    }

    private List<OrderItemDetail> getItemDetails(List<OrderItem> orderItemList) {
        return orderItemList.stream().map(orderItem -> {
            return OrderItemDetail.builder()
                    .id(orderItem.getId())
                    .itemPrice(orderItem.getItemPrice())
                    .product(orderItem.getProduct())
                    .productVariantId(orderItem.getProductVariantId())
                    .quantity(orderItem.getQuantity())
                    .build();
        }).toList();
    }

    public void cancelOrder(UUID id, Principal principal) {
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());
        Order order = orderRepository.findById(id).get();
        if (null != order && order.getUser().getId().equals(user.getId())) {
            order.setOrderStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
        } else {
            throw new RuntimeException("Invalid request");
        }
    }

    public void updateOrderStatus(UUID id, String status) throws BadRequestException {
        Order order = orderRepository.findById(id).orElseThrow(BadRequestException::new);
        order.setOrderStatus(OrderStatus.valueOf(status));
        orderRepository.save(order);
    }
}

