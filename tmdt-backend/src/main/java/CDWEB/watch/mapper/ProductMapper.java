package CDWEB.watch.mapper;

import CDWEB.watch.dto.ProductDto;
import CDWEB.watch.dto.ProductResourceDto;
import CDWEB.watch.dto.ProductVariantDto;
import CDWEB.watch.entity.*;

import CDWEB.watch.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    @Autowired
    private CategoryService categoryService;

    public Product mapToProductEntity(ProductDto productDto) {
        Product product = new Product();

        if (productDto.getId() != null) {
            product.setId(productDto.getId());
        }

        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setBrand(productDto.getBrand());
        product.setNewArrival(productDto.isNewArrival());
        product.setPrice(productDto.getPrice());
        product.setRating(productDto.getRating());
        product.setSlug(productDto.getSlug());

        // ✅ Bắt buộc phải có categoryId
        if (productDto.getCategoryId() != null) {
            Category category = categoryService.getCategory(productDto.getCategoryId());

            if (category != null) {
                product.setCategory(category); // ✅ PHẢI SET

                // ✅ Lấy categoryType từ category nếu có
                if (productDto.getCategoryTypeId() != null) {
                    CategoryType categoryType = category.getCategoryTypes().stream()
                            .filter(ct -> ct.getId().equals(productDto.getCategoryTypeId()))
                            .findFirst()
                            .orElse(null);

                    product.setCategoryType(categoryType); // ✅ PHẢI SET
                }
            }
        }

        // ✅ Gán biến thể
        if (productDto.getVariants() != null) {
            product.setProductVariants(mapToProductVariant(productDto.getVariants(), product));
        }

        // ✅ Gán ảnh
        if (productDto.getProductResources() != null) {
            product.setResources(mapToProductResources(productDto.getProductResources(), product));
        }

        return product;
    }


    private List<Resources> mapToProductResources(List<ProductResourceDto> productResources, Product product) {

        return productResources.stream().map(productResourceDto -> {
            Resources resources= new Resources();
            if(null != productResourceDto.getId()){
                resources.setId(productResourceDto.getId());
            }
            resources.setName(productResourceDto.getName());
            resources.setType(productResourceDto.getType());
            resources.setUrl(productResourceDto.getUrl());
            resources.setIsPrimary(productResourceDto.getIsPrimary());
            resources.setProduct(product);
            return resources;
        }).collect(Collectors.toList());
    }

    private List<ProductVariant> mapToProductVariant(List<ProductVariantDto> productVariantDtos, Product product){
        return productVariantDtos.stream().map(productVariantDto -> {
            ProductVariant productVariant = new ProductVariant();
            if(null != productVariantDto.getId()){
                productVariant.setId(productVariantDto.getId());
            }
            productVariant.setColor(productVariantDto.getColor());
            productVariant.setSize(productVariantDto.getSize());
            productVariant.setStockQuantity(productVariantDto.getStockQuantity());
            productVariant.setProduct(product);
            return productVariant;
        }).collect(Collectors.toList());
    }


    public List<ProductDto> getProductDtos(List<Product> products) {
        return products.stream().map(this::mapProductToDto).toList();
    }

    public ProductDto mapProductToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .brand(product.getBrand())
                .name(product.getName())
                .price(product.getPrice())
                .isNewArrival(product.isNewArrival())
                .rating(product.getRating())
                .description(product.getDescription())
                .slug(product.getSlug())
                .thumbnail(getProductThumbnail(product.getResources()))
                .categoryId(product.getCategoryType() != null ? product.getCategoryType().getId() : null)
                .categoryName(product.getCategoryType() != null ? product.getCategoryType().getName() : null)
                .categoryTypeId(product.getCategoryType() != null ? product.getCategoryType().getId() : null)
                .categoryTypeName(product.getCategoryType() != null ? product.getCategoryType().getName() : null)
                .variants(mapProductVariantListToDto(product.getProductVariants()))
                .productResources(mapProductResourcesListDto(product.getResources()))
                .build();
    }

    private String getProductThumbnail(List<Resources> resources) {
        if (resources == null || resources.isEmpty()) {
            return null;
        }

        return resources.stream()
                .filter(Resources::getIsPrimary)
                .findFirst()
                .map(Resources::getUrl)
                .orElse(null);
    }



    public List<ProductVariantDto> mapProductVariantListToDto(List<ProductVariant> productVariants) {
        return productVariants.stream().map(this::mapProductVariantDto).toList();
    }

    private ProductVariantDto mapProductVariantDto(ProductVariant productVariant) {
        return ProductVariantDto.builder()
                .color(productVariant.getColor())
                .id(productVariant.getId())
                .size(productVariant.getSize())
                .stockQuantity(productVariant.getStockQuantity())
                .build();
    }

    public List<ProductResourceDto> mapProductResourcesListDto(List<Resources> resources) {
        return resources.stream().map(this::mapResourceToDto).toList();
    }

    private ProductResourceDto mapResourceToDto(Resources resources) {
        return ProductResourceDto.builder()
                .id(resources.getId())
                .url(resources.getUrl())
                .name(resources.getName())
                .isPrimary(resources.getIsPrimary())
                .type(resources.getType())
                .build();
    }
}
