package CDWEB.watch.controller;




import CDWEB.watch.dto.ProductDto;
import CDWEB.watch.entity.Product;
import CDWEB.watch.service.ProductService;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    private ProductService productService;

    @Autowired
    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts(@RequestParam(required = false,name = "categoryId",value = "categoryId") UUID categoryId, @RequestParam(required = false,name = "typeId",value = "typeId") UUID typeId, @RequestParam(required = false) String slug, HttpServletResponse response){
        List<ProductDto> productList = new ArrayList<>();
        if(StringUtils.isNotBlank(slug)){
            ProductDto productDto = productService.getProductBySlug(slug);
            productList.add(productDto);
        }
        else {
            productList = productService.getAllProducts(categoryId, typeId);
        }
        response.setHeader("Content-Range",String.valueOf(productList.size()));
        return new ResponseEntity<>(productList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable UUID id){
        ProductDto productDto = productService.getProductById(id);
        return new ResponseEntity<>(productDto, HttpStatus.OK);
    }

    //   create Product
    @PostMapping
    public ResponseEntity<Product> createProduct(@Validated @RequestBody ProductDto productDto, BindingResult result) {
        if (result.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Product product = productService.addProduct(productDto);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@RequestBody ProductDto productDto,@PathVariable UUID id){
        Product product = productService.updateProduct(productDto,id);
        return new ResponseEntity<>(product,HttpStatus.OK);
    }
    // Xóa sản phẩm theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable UUID id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy sản phẩm để xóa");
        }
    }


}
