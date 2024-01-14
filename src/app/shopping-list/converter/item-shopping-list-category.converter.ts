import { ItemShoppingListCategoryDto } from "../dto/item-shopping-list-category.dto";
import { ItemShoppingListCategory } from "../model/item-shopping-list-category.model";

export abstract class ItemShoppingListCategoryConverter {
    public static fromDtoToModel(itemShoppingListCategoryDto: ItemShoppingListCategoryDto): ItemShoppingListCategory {
        return new ItemShoppingListCategory(
            itemShoppingListCategoryDto.id,
            itemShoppingListCategoryDto.code,
            itemShoppingListCategoryDto.name
        );
    }

    public static fromModelToDto(itemShoppingListCategory: ItemShoppingListCategory): ItemShoppingListCategoryDto {
        return new ItemShoppingListCategoryDto(
            itemShoppingListCategory.id,
            itemShoppingListCategory.code,
            itemShoppingListCategory.name
        );
    }
}