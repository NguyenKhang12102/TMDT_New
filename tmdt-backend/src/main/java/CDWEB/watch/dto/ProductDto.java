    package CDWEB.watch.dto;

    import lombok.*;


    import java.math.BigDecimal;
    import java.util.List;
    import java.util.UUID;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class ProductDto {

        private UUID id;
        private String name;
        private String description;
        private BigDecimal price;
        private String brand;
        private boolean isNewArrival;
        private Float rating;
        private UUID categoryId;
        private String thumbnail;
        private String slug;
        private String categoryName;
        private Long totalSold; // thêm dòng này


        private UUID categoryTypeId;
        private String categoryTypeName;
        private List<ProductVariantDto> variants;
        private List<ProductResourceDto> productResources;
    }

