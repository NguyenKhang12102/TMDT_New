package CDWEB.watch.repository;
import java.util.List;


import CDWEB.watch.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    Product findBySlug(String slug);


    List<Product> findByCategoryType_Id(UUID categoryTypeId); // OK


}

