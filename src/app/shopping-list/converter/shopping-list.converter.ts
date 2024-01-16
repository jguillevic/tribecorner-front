import {ShoppingListDto} from "../dto/shopping-list.dto";
import {ShoppingList} from "../model/shopping-list.model";
import {ItemShoppingListConverter} from "./item-shopping-list.converter";

export abstract class ShoppingListConverter {
    public static fromDtoToModel(shoppingListDto: ShoppingListDto): ShoppingList {
        return new ShoppingList(
          shoppingListDto.id,
          shoppingListDto.name,
          shoppingListDto.isArchived,
          shoppingListDto.items.map(itemShoppingListDto => 
            ItemShoppingListConverter.fromDtoToModel(itemShoppingListDto)
          )
        );
    }

    public static fromModelToDto(shoppingList: ShoppingList): ShoppingListDto {
        const shoppingListDto = new ShoppingListDto(
          shoppingList.id,
          shoppingList.name,
          shoppingList.isArchived,
          shoppingList.items.map(itemShoppingList =>
            ItemShoppingListConverter.fromModelToDto(itemShoppingList)
          )
        );
    
        return shoppingListDto;
    }
}