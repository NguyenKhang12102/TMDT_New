package CDWEB.watch.controller;

import CDWEB.watch.service.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import CDWEB.watch.dto.RevenueDataPoint;
import CDWEB.watch.dto.RevenueByCategoryDataPoint;

@RestController
@RequestMapping("/api/admin/statistics")
@CrossOrigin
public class StatisticController {

    @Autowired
    private StatisticService statisticService;

    @GetMapping("/revenue-by-time")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<RevenueDataPoint>> getRevenueByTime(@RequestParam String period) {
        List<RevenueDataPoint> revenue = statisticService.getRevenueByTime(period);
        return new ResponseEntity<>(revenue, HttpStatus.OK);
    }

    @GetMapping("/revenue-by-category")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<RevenueByCategoryDataPoint>> getRevenueByCategoryForMonth(
            @RequestParam int year,
            @RequestParam int month) {
        List<RevenueByCategoryDataPoint> revenue = statisticService.getRevenueByCategoryForMonth(year, month);
        return new ResponseEntity<>(revenue, HttpStatus.OK);
    }

    @GetMapping("/total-revenue")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Double> getTotalRevenue() {
        Double totalRevenue = statisticService.getTotalRevenue();
        return new ResponseEntity<>(totalRevenue, HttpStatus.OK);
    }
} 