import { ItemShoppingList } from "./item-shopping-list.model";

export class ShoppingList {
    public id: number|undefined;
    public name: string;
    public isArchived: boolean;
    public items: ItemShoppingList[];

    constructor() {
        this.name = '';
        this.isArchived = false;
        this.items = [];
    }
}