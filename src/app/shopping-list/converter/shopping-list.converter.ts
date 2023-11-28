import { EditShoppingListDto } from "../dto/edit-shopping-list.dto";
import { LoadShoppingListDto } from "../dto/load-shopping-list.dto";
import { ShoppingList } from "../model/shopping-list.model";
import { ItemShoppingListConverter } from "./item-shopping-list.converter";

export abstract class ShoppingListConverter {
    public static fromDtoToModel(loadShoppingListDto: LoadShoppingListDto): ShoppingList {
        const shoppingList = new ShoppingList();

        shoppingList.id = loadShoppingListDto.id;
        shoppingList.name = loadShoppingListDto.name;
        shoppingList.isArchived = loadShoppingListDto.isArchived;
    
        loadShoppingListDto.items.forEach(loadItemShoppingListDto => {
          const itemShoppingList = ItemShoppingListConverter.fromDtoToModel(loadItemShoppingListDto);
          shoppingList.items.push(itemShoppingList);
        });
    
        return shoppingList;
    }

    public static fromModelToDto(shoppingList: ShoppingList): EditShoppingListDto {
        const editShoppingListDto = new EditShoppingListDto();

        editShoppingListDto.id = shoppingList.id;
        editShoppingListDto.name = shoppingList.name;
        editShoppingListDto.isArchived = shoppingList.isArchived;
    
        shoppingList.items.forEach(itemShoppingList => {
          const editItemShoppingListDto = ItemShoppingListConverter.fromModelToDto(itemShoppingList);
          editShoppingListDto.items.push(editItemShoppingListDto);
        });
    
        return editShoppingListDto;
    }
}