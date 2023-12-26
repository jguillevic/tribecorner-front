import { ItemShoppingList } from "../model/item-shopping-list.model";
import { ShoppingList } from "../model/shopping-list.model";

export abstract class ShoppingListHelper {
    public static copy(shoppingListToCopy: ShoppingList, copyIds: boolean = true): ShoppingList {
        const copiedShoppingList = new ShoppingList();
    
        copiedShoppingList.id = copyIds ? shoppingListToCopy.id : 0;
        copiedShoppingList.name = shoppingListToCopy.name;
        copiedShoppingList.isArchived = shoppingListToCopy.isArchived;
        shoppingListToCopy.items.forEach(item => {
            const copiedItemShoppingList = new ItemShoppingList();
            copiedItemShoppingList.id = copyIds ? item.id : undefined;
            copiedItemShoppingList.name = item.name;
            copiedItemShoppingList.isChecked = item.isChecked;
            copiedItemShoppingList.position = item.position;
            copiedShoppingList.items.push(copiedItemShoppingList);
        });
    
        return copiedShoppingList;
      }
}