package CDWEB.watch.service;

import CDWEB.watch.entity.CategoryType;
import CDWEB.watch.repository.CategoryTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryTypeService {

    private final CategoryTypeRepository categoryTypeRepository;

    public CategoryTypeService(CategoryTypeRepository categoryTypeRepository) {
        this.categoryTypeRepository = categoryTypeRepository;
    }

    public List<CategoryType> getAllCategoryTypes() {
        return categoryTypeRepository.findAll();
    }
}

