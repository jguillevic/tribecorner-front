import { ItemShoppingListCategory } from "./item-shopping-list-category.model";

export class ItemShoppingList {
    public constructor(
        public id: number|undefined,
        public name: string = '',
        public category: ItemShoppingListCategory,
        public shoppingListId: number,
        public isChecked: boolean = false,
        public position: number = 0
    ) { }
}