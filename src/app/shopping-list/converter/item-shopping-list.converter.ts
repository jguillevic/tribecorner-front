import { EditItemShoppingListDto } from "../dto/edit-item-shopping-list.dto";
import { LoadItemShoppingListDto } from "../dto/load-item-shopping-list.dto";
import { ItemShoppingList } from "../model/item-shopping-list.model";

export abstract class ItemShoppingListConverter {
    public static fromDtoToModel(loadItemShoppingListDto: LoadItemShoppingListDto): ItemShoppingList {
        const itemShoppingList: ItemShoppingList 
        = new ItemShoppingList(
            loadItemShoppingListDto.id,
            loadItemShoppingListDto.name,
            loadItemShoppingListDto.isChecked,
            loadItemShoppingListDto.position
        );
    
        return itemShoppingList;
    }

    public static fromModelToDto(itemShoppingList: ItemShoppingList): EditItemShoppingListDto {
        const editItemShoppingListDto = new EditItemShoppingListDto();

        editItemShoppingListDto.id = itemShoppingList.id;
        editItemShoppingListDto.name = itemShoppingList.name;
        editItemShoppingListDto.isChecked = itemShoppingList.isChecked;
        editItemShoppingListDto.position = itemShoppingList.position;
    
        return editItemShoppingListDto;
    }
}