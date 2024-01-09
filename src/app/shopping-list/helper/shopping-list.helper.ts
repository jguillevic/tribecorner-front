import { ItemShoppingList } from "../model/item-shopping-list.model";
import { ShoppingList } from "../model/shopping-list.model";

export abstract class ShoppingListHelper {
    public static copy(shoppingListToCopy: ShoppingList, copyIds: boolean = true): ShoppingList {
        const copiedShoppingList = new ShoppingList();
    
        copiedShoppingList.id = copyIds ? shoppingListToCopy.id : undefined;
        copiedShoppingList.name = shoppingListToCopy.name;
        copiedShoppingList.isArchived = shoppingListToCopy.isArchived;
        shoppingListToCopy.items.forEach(item => {
            const copiedItemShoppingList 
            = new ItemShoppingList(
                copyIds ? item.id : undefined,
                item.name,
                item.shoppingListId,
                item.isChecked,
                item.position
            );
            copiedShoppingList.items.push(copiedItemShoppingList);
        });
    
        return copiedShoppingList;
      }
}