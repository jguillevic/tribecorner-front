import { ItemShoppingList } from "./item-shopping-list.model";

export class ShoppingList {
    public id: number|undefined;
    public name: string;
    public familyId: number;
    public isArchived: boolean;
    public items: ItemShoppingList[];

    constructor() {
        this.name = '';
        this.familyId = -1;
        this.isArchived = false;
        this.items = [];
    }
}