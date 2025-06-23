package CDWEB.watch.repository;


import CDWEB.watch.entity.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CategoryTypeRepository extends JpaRepository<CategoryType, UUID> {
}

