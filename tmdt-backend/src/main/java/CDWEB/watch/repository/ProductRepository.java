package CDWEB.watch.repository;
import java.util.List;


import CDWEB.watch.entity.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {



    List<Product> findByCategoryType_Id(UUID categoryTypeId); // OK
    @Query("SELECT p FROM Product p ORDER BY p.createdAt DESC")
    List<Product> findNewestProducts(Pageable pageable);

    @Query("SELECT oi.product AS product, SUM(oi.quantity) AS totalSold " +
            "FROM OrderItem oi " +
            "GROUP BY oi.product " +
            "ORDER BY totalSold DESC")
    List<Object[]> findBestSellingProducts(Pageable pageable);

    @Query("SELECT p FROM Product p ORDER BY p.viewCount DESC")
    List<Product> findMostViewedProducts(Pageable pageable);

    Optional<Product> findBySlug(String slug); // ✅



}

