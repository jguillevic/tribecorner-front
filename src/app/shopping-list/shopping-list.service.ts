import { Injectable } from '@angular/core';
import { ShoppingList } from './shopping-list';
import { ItemShoppingList } from './item-shopping-list';

@Injectable()
export class ShoppingListService {

  constructor() { }

  getOne(): ShoppingList {
    const shoppingList: ShoppingList = new ShoppingList();
    shoppingList.id = 1;
    shoppingList.name = 'Ma liste de course';

    const itemShoppingList1: ItemShoppingList = new ItemShoppingList()
    itemShoppingList1.id = 1;
    itemShoppingList1.name = 'Litière';
    itemShoppingList1.isChecked = true;
    shoppingList.items.push(itemShoppingList1);

    const itemShoppingList2: ItemShoppingList = new ItemShoppingList()
    itemShoppingList2.id = 2;
    itemShoppingList2.name = 'Fromages';
    shoppingList.items.push(itemShoppingList2);

    return shoppingList;
  }

  save(shoppingList: ShoppingList): void { }
}
