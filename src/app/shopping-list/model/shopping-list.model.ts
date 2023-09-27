import { ItemShoppingList } from "./item-shopping-list.model";

export class ShoppingList {
    public id: number|undefined;
    public name: string;
    public familyId: number;
    public favorite: boolean;
    public items: ItemShoppingList[];

    constructor() {
        this.name = '';
        this.familyId = -1;
        this.favorite = false;
        this.items = [];
    }
}