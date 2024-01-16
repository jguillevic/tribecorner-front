import {ItemShoppingList} from "./item-shopping-list.model";

export class ShoppingList {
    public constructor(
        public id: number|undefined = undefined,
        public name: string = '',
        public isArchived: boolean = false,
        public items: ItemShoppingList[] = []
    ) { }
}