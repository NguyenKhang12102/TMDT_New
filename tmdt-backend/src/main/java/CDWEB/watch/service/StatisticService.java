package CDWEB.watch.service;

import CDWEB.watch.dto.RevenueByCategoryDataPoint;
import CDWEB.watch.dto.RevenueDataPoint;

import java.util.List;
import java.util.Map;

public interface StatisticService {
    // Thống kê doanh thu theo thời gian (ví dụ: daily, monthly, yearly)
    List<RevenueDataPoint> getRevenueByTime(String period);

    // Thống kê doanh thu theo danh mục trong một tháng cụ thể
    List<RevenueByCategoryDataPoint> getRevenueByCategoryForMonth(int year, int month);

    // Có thể thêm các phương thức khác nếu cần, ví dụ tổng quan doanh thu
    Double getTotalRevenue();
} 