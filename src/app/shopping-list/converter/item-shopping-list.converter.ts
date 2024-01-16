import {ItemShoppingListDto} from "../dto/item-shopping-list.dto";
import {ItemShoppingList} from "../model/item-shopping-list.model";
import {ItemShoppingListCategoryConverter} from "./item-shopping-list-category.converter";

export abstract class ItemShoppingListConverter {
    public static fromDtoToModel(itemShoppingListDto: ItemShoppingListDto): ItemShoppingList {
        return new ItemShoppingList(
            itemShoppingListDto.id,
            itemShoppingListDto.name,
            ItemShoppingListCategoryConverter.fromDtoToModel(itemShoppingListDto.category),
            itemShoppingListDto.shoppingListId,
            itemShoppingListDto.isChecked,
            itemShoppingListDto.position
        );
    }

    public static fromModelToDto(itemShoppingList: ItemShoppingList): ItemShoppingListDto {
        const editItemShoppingListDto 
        = new ItemShoppingListDto(
            itemShoppingList.id,
            itemShoppingList.name,
            ItemShoppingListCategoryConverter.fromModelToDto(itemShoppingList.category),
            itemShoppingList.shoppingListId,
            itemShoppingList.isChecked,
            itemShoppingList.position
        );

        return editItemShoppingListDto;
    }
}