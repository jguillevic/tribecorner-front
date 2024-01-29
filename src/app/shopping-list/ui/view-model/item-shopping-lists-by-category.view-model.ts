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
        public isExpanded: boolean
    ) { }

    /**
     * Calcule et affecte la valeur du champ IsExpanded.
     * @returns true si isExpanded a changé suite au calcul.
     * false sinon.
     */
    public calcIsExpanded(): boolean {
        const previousIsExpandedValue: boolean = this.isExpanded;

        this.isExpanded 
        = this.itemShoppingLists
        .find(
            (itemShoppingList: ItemShoppingList) => 
            !itemShoppingList.isChecked
        ) !== undefined;

        return previousIsExpandedValue !== this.isExpanded;
    }
}