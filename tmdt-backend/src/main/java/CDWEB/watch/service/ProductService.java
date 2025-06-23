package CDWEB.watch.service;

import CDWEB.watch.dto.ProductDto;
import CDWEB.watch.entity.Product;

import java.util.List;
import java.util.UUID;

public interface ProductService {

    public Product addProduct(ProductDto product);
    public List<ProductDto> getAllProducts(UUID categoryId, UUID typeId);

    ProductDto getProductBySlug(String slug);

    ProductDto getProductById(UUID id);

    Product updateProduct(ProductDto productDto, UUID id);

    Product fetchProductById(UUID uuid) throws Exception;

    List<ProductDto> getProductsByCategoryTypeId(UUID typeId);

    void deleteProduct(UUID id) throws Exception;
    List<ProductDto> getBestSellingProducts(int limit);
    List<ProductDto> getNewestProducts(int limit);
    List<ProductDto> getMostViewedProducts(int limit);

}

