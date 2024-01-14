import { EditItemShoppingListDto } from "../dto/edit-item-shopping-list.dto";
import { LoadItemShoppingListDto } from "../dto/load-item-shopping-list.dto";
import { ItemShoppingList } from "../model/item-shopping-list.model";
import { ItemShoppingListCategoryConverter } from "./item-shopping-list-category.converter";

export abstract class ItemShoppingListConverter {
    public static fromDtoToModel(loadItemShoppingListDto: LoadItemShoppingListDto): ItemShoppingList {
        return new ItemShoppingList(
            loadItemShoppingListDto.id,
            loadItemShoppingListDto.name,
            ItemShoppingListCategoryConverter.fromDtoToModel(loadItemShoppingListDto.category),
            loadItemShoppingListDto.shoppingListId,
            loadItemShoppingListDto.isChecked,
            loadItemShoppingListDto.position
        );
    }

    public static fromModelToDto(itemShoppingList: ItemShoppingList): EditItemShoppingListDto {
        const editItemShoppingListDto 
        = new EditItemShoppingListDto(
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