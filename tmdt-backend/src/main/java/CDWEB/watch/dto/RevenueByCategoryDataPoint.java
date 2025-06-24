package CDWEB.watch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueByCategoryDataPoint {
    private String categoryName;
    private Double revenue;
} 