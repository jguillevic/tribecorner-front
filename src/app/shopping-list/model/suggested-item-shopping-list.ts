import {ItemShoppingListCategory} from "./item-shopping-list-category.model";

export class SuggestedItemShoppingList {
    public constructor(
        public readonly name: string,
        public readonly category: ItemShoppingListCategory,
        public readonly count: number
    ) { }
}