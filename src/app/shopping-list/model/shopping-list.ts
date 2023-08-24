import { ItemShoppingList } from "./item-shopping-list";

export class ShoppingList {
    public id: number;
    public name: string;
    public items: ItemShoppingList[]; 

    constructor() {
        this.id = -1;
        this.name = '';
        this.items = [];
    }
}