package CDWEB.watch.service.impl;


import CDWEB.watch.dto.ProductDto;
import CDWEB.watch.entity.Product;
import CDWEB.watch.entity.CategoryType;
import CDWEB.watch.exception.ResourceNotFoundEx;
import CDWEB.watch.mapper.ProductMapper;
import CDWEB.watch.repository.ProductRepository;
import CDWEB.watch.repository.CategoryTypeRepository;
import CDWEB.watch.service.CategoryService;
import CDWEB.watch.service.ProductService;
import CDWEB.watch.specification.ProductSpecification;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private CategoryTypeRepository categoryTypeRepository;


    @Override
    public Product addProduct(ProductDto productDto) {
        Product product = productMapper.mapToProductEntity(productDto);

        // Gán CategoryType
        if (productDto.getCategoryTypeId() != null) {
            CategoryType categoryType = categoryTypeRepository.findById(productDto.getCategoryTypeId())
                    .orElseThrow(() -> new ResourceNotFoundEx("CategoryType not found"));
            product.setCategoryType(categoryType);

            // Gán Category từ CategoryType
            product.setCategory(categoryType.getCategory());
        } else {
            throw new IllegalArgumentException("CategoryTypeId is required");
        }

        return productRepository.save(product);
    }


    @Override
    public List<ProductDto> getAllProducts(UUID categoryId, UUID typeId) {

        Specification<Product> productSpecification= Specification.where(null);

        if(null != categoryId){
            productSpecification = productSpecification.and(ProductSpecification.hasCategoryId(categoryId));
        }
        if(null != typeId){
            productSpecification = productSpecification.and(ProductSpecification.hasCategoryTypeId(typeId));
        }

        List<Product> products = productRepository.findAll(productSpecification);
        return productMapper.getProductDtos(products);
    }

    @Override
    public ProductDto getProductBySlug(String slug) {
        Product product= productRepository.findBySlug(slug);
        if(null == product){
            throw new ResourceNotFoundEx("Product Not Found!");
        }
        ProductDto productDto = productMapper.mapProductToDto(product);
        productDto.setCategoryId(product.getCategoryType().getId());
        productDto.setCategoryTypeId(product.getCategoryType().getId());
        productDto.setVariants(productMapper.mapProductVariantListToDto(product.getProductVariants()));
        productDto.setProductResources(productMapper.mapProductResourcesListDto(product.getResources()));
        return productDto;
    }

    @Override
    public ProductDto getProductById(UUID id) {
        Product product= productRepository.findById(id).orElseThrow(()-> new ResourceNotFoundEx("Product Not Found!"));
        ProductDto productDto = productMapper.mapProductToDto(product);
        productDto.setCategoryId(product.getCategoryType().getId());
        productDto.setCategoryTypeId(product.getCategoryType().getId());
        productDto.setVariants(productMapper.mapProductVariantListToDto(product.getProductVariants()));
        productDto.setProductResources(productMapper.mapProductResourcesListDto(product.getResources()));
        return productDto;
    }

    @Override
    public Product updateProduct(ProductDto productDto, UUID id) {
        // Tìm sản phẩm hiện tại
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundEx("Product Not Found!"));

        // Map DTO → Entity
        Product updatedProduct = productMapper.mapToProductEntity(productDto);

        // ⚠️ Gán lại ID vì Hibernate cần đúng ID mới cập nhật
        updatedProduct.setId(existingProduct.getId());

        // ⚠️ Gán lại category và categoryType nếu cần
        if (productDto.getCategoryTypeId() != null) {
            CategoryType categoryType = categoryTypeRepository.findById(productDto.getCategoryTypeId())
                    .orElseThrow(() -> new ResourceNotFoundEx("CategoryType not found"));

            updatedProduct.setCategoryType(categoryType);
            updatedProduct.setCategory(categoryType.getCategory()); // ⚠️ KHÔNG ĐƯỢC THIẾU
        } else {
            throw new IllegalArgumentException("CategoryTypeId is required");
        }

        return productRepository.save(updatedProduct);
    }


    @Override
    public Product fetchProductById(UUID id) throws Exception {
        return productRepository.findById(id).orElseThrow(BadRequestException::new);
    }
    @Override
    public void deleteProduct(UUID id) throws Exception {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new Exception("Không tìm thấy sản phẩm với id: " + id));
        productRepository.delete(product);
    }

    @Override
    public List<ProductDto> getProductsByCategoryTypeId(UUID typeId) {
        List<Product> products = productRepository.findAll(
                ProductSpecification.hasCategoryTypeId(typeId)
        );
        return productMapper.getProductDtos(products);
    }




}
