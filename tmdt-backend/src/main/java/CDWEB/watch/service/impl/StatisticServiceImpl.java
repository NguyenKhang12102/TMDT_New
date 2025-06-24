package CDWEB.watch.service.impl;

import CDWEB.watch.entity.Order;
import CDWEB.watch.entity.OrderItem;
import CDWEB.watch.entity.OrderStatus;
import CDWEB.watch.entity.Product;
import CDWEB.watch.entity.Category;
import CDWEB.watch.repository.MainOrderRepository;
import CDWEB.watch.repository.ProductRepository;
import CDWEB.watch.service.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import CDWEB.watch.dto.RevenueDataPoint;
import CDWEB.watch.dto.RevenueByCategoryDataPoint;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatisticServiceImpl implements StatisticService {

    @Autowired
    private MainOrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<RevenueDataPoint> getRevenueByTime(String period) {
        List<Order> deliveredOrders = orderRepository.findByOrderStatus(OrderStatus.DELIVERED);
        List<Order> shippedOrders = orderRepository.findByOrderStatus(OrderStatus.SHIPPED);

        List<Order> completedOrders = new ArrayList<>();
        completedOrders.addAll(deliveredOrders);
        completedOrders.addAll(shippedOrders);

        Map<String, Double> revenueByTimeMap = new HashMap<>();

        for (Order order : completedOrders) {
            LocalDateTime orderTime = order.getOrderDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
            String key;

            switch (period.toLowerCase()) {
                case "daily":
                    key = orderTime.toLocalDate().toString(); // YYYY-MM-DD
                    break;
                case "monthly":
                    key = String.format("%d-%02d", orderTime.getYear(), orderTime.getMonthValue()); // YYYY-MM
                    break;
                case "yearly":
                    key = String.valueOf(orderTime.getYear()); // YYYY
                    break;
                default:
                    throw new IllegalArgumentException("Invalid period: " + period + ". Must be 'daily', 'monthly', or 'yearly'.");
            }
            revenueByTimeMap.merge(key, order.getTotalAmount().doubleValue(), Double::sum);
        }

        return revenueByTimeMap.entrySet().stream()
                .map(entry -> new RevenueDataPoint(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(RevenueDataPoint::getPeriod)) // Sort by period for consistent order
                .collect(Collectors.toList());
    }

    @Override
    public List<RevenueByCategoryDataPoint> getRevenueByCategoryForMonth(int year, int month) {
        LocalDateTime startOfMonth = LocalDateTime.of(year, month, 1, 0, 0, 0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minus(1, ChronoUnit.MILLIS);

        List<Order> deliveredOrders = orderRepository.findByOrderStatusAndOrderDateBetween(OrderStatus.DELIVERED, startOfMonth, endOfMonth);
        List<Order> shippedOrders = orderRepository.findByOrderStatusAndOrderDateBetween(OrderStatus.SHIPPED, startOfMonth, endOfMonth);

        List<Order> completedOrders = new ArrayList<>();
        completedOrders.addAll(deliveredOrders);
        completedOrders.addAll(shippedOrders);

        Map<String, Double> revenueByCategoryMap = new HashMap<>();

        for (Order order : completedOrders) {
            for (OrderItem item : order.getOrderItemList()) {
                String categoryName = "Unknown"; // Default category name
                Product product = item.getProduct();
                if (product != null) {
                    Category category = product.getCategory();
                    if (category != null && category.getName() != null) {
                        categoryName = category.getName();
                    }
                }

                double itemPrice = (item.getItemPrice() != null) ? item.getItemPrice().doubleValue() : 0.0;
                revenueByCategoryMap.merge(categoryName, itemPrice * item.getQuantity(), Double::sum);
            }
        }
        return revenueByCategoryMap.entrySet().stream()
                .map(entry -> new RevenueByCategoryDataPoint(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(RevenueByCategoryDataPoint::getCategoryName)) // Sort by category name
                .collect(Collectors.toList());
    }

    @Override
    public Double getTotalRevenue() {
        List<Order> deliveredOrders = orderRepository.findByOrderStatus(OrderStatus.DELIVERED);
        List<Order> shippedOrders = orderRepository.findByOrderStatus(OrderStatus.SHIPPED);

        List<Order> completedOrders = new ArrayList<>();
        completedOrders.addAll(deliveredOrders);
        completedOrders.addAll(shippedOrders);

        return completedOrders.stream()
                .mapToDouble(order -> order.getTotalAmount().doubleValue())
                .sum();
    }
}
