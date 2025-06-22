package CDWEB.watch.controller;

import CDWEB.watch.entity.CategoryType;
import CDWEB.watch.service.CategoryTypeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category-types")
@CrossOrigin(origins = "*")
public class CategoryTypeController {

    private final CategoryTypeService categoryTypeService;

    public CategoryTypeController(CategoryTypeService categoryTypeService) {
        this.categoryTypeService = categoryTypeService;
    }

    @GetMapping
    public List<CategoryType> getAllCategoryTypes() {
        return categoryTypeService.getAllCategoryTypes();
    }
}

