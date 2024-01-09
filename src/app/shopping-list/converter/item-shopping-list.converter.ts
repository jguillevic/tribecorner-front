import { EditItemShoppingListDto } from "../dto/edit-item-shopping-list.dto";
import { LoadItemShoppingListDto } from "../dto/load-item-shopping-list.dto";
import { ItemShoppingList } from "../model/item-shopping-list.model";

export abstract class ItemShoppingListConverter {
    public static fromDtoToModel(loadItemShoppingListDto: LoadItemShoppingListDto): ItemShoppingList {
        const itemShoppingList: ItemShoppingList 
        = new ItemShoppingList(
            loadItemShoppingListDto.id,
            loadItemShoppingListDto.name,
            loadItemShoppingListDto.shoppingListId,
            loadItemShoppingListDto.isChecked,
            loadItemShoppingListDto.position
        );
    
        return itemShoppingList;
    }

    public static fromModelToDto(itemShoppingList: ItemShoppingList): EditItemShoppingListDto {
        const editItemShoppingListDto 
        = new EditItemShoppingListDto(
            itemShoppingList.id,
            itemShoppingList.name,
            itemShoppingList.shoppingListId,
            itemShoppingList.isChecked,
            itemShoppingList.position
        );

        return editItemShoppingListDto;
    }
}