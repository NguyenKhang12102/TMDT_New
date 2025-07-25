package CDWEB.watch.specification;


import CDWEB.watch.entity.Product;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class ProductSpecification {

    public static Specification<Product> hasCategoryId(UUID categorId){
        return  (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("category").get("id"),categorId);
    }

    public static Specification<Product> hasCategoryTypeId(UUID typeId) {
        return (root, query, cb) -> cb.equal(root.get("categoryType").get("id"), typeId);
    }

}
