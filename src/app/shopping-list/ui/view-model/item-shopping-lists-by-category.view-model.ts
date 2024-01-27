import {ItemShoppingListCategory} from "../../model/item-shopping-list-category.model";
import {ItemShoppingList} from "../../model/item-shopping-list.model";

export class ItemShoppingListsByCategoryViewModel {
    public get itemsLength(): number {
        return this.itemShoppingLists.length;
    }

    public get checkedItemsLength(): number {
        return this.itemShoppingLists
        .filter((itemShoppingList: ItemShoppingList) => itemShoppingList.isChecked)
        .length;
    }

    public constructor(
        public readonly category: ItemShoppingListCategory,
        public readonly itemShoppingLists: ItemShoppingList[],
        public isExpanded: boolean|undefined
    ) {
        if (!isExpanded) {
            this.calcIsExpanded();
        }
    }

    public calcIsExpanded() {
        this.isExpanded 
        = this.itemShoppingLists
        .find(
            (itemShoppingList: ItemShoppingList) => 
            !itemShoppingList.isChecked
        ) !== undefined;
    }
}