import { ItemShoppingList } from "./item-shopping-list.model";

export class ShoppingList {
    public id: number|undefined;
    public name: string;
    public familyId: number;
    public isFavorite: boolean;
    public items: ItemShoppingList[];

    constructor() {
        this.name = '';
        this.familyId = -1;
        this.isFavorite = false;
        this.items = [];
    }
}