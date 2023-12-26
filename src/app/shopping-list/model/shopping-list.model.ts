import { ItemShoppingList } from "./item-shopping-list.model";

export class ShoppingList {
    public constructor(
        public id: number = 0,
        public name: string = '',
        public isArchived: boolean = false,
        public isPinned: boolean = false,
        public items: ItemShoppingList[] = []
    ) { }
}