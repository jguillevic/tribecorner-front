import { ItemShoppingList } from "./item-shopping-list";

export class ShoppingList {
    id: number;
    name: string;
    items: ItemShoppingList[]; 

    constructor() {
        this.id = -1;
        this.name = '';
        this.items = [];
    }
}