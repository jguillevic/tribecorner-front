import { Injectable } from '@angular/core';
import { ShoppingList } from '../model/shopping-list.model';
import { ItemShoppingList } from '../model/item-shopping-list.model';

@Injectable()
export class ShoppingListCopierService {

  public constructor() { }

  public copy(shoppingListToCopy: ShoppingList, copyIds: boolean = true): ShoppingList {
    const copiedShoppingList = new ShoppingList();

    copiedShoppingList.id = copyIds ? shoppingListToCopy.id : undefined;
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
