import {ItemShoppingListCategory} from "../../model/item-shopping-list-category.model";
import {ItemShoppingList} from "../../model/item-shopping-list.model";

export class ItemShoppingListsByCategoryViewModel {
    public constructor(
        public readonly category: ItemShoppingListCategory,
        public readonly itemShoppingLists: ItemShoppingList[]
    ) {}
}