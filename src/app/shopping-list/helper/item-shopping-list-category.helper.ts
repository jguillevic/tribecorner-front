import {ItemShoppingListCategory} from "../model/item-shopping-list-category.model";

export abstract class ItemShoppingListCategoryHelper {
    public static unknownCode: string = "UNKNOWN";

    public static compare(
        itemShoppingListCategory1: ItemShoppingListCategory,
        itemShoppingListCategory2: ItemShoppingListCategory
    ): number {
        if (
            itemShoppingListCategory1.code === ItemShoppingListCategoryHelper.unknownCode &&
            itemShoppingListCategory2.code !== ItemShoppingListCategoryHelper.unknownCode
        ) {
            return 1;
        } else if (
            itemShoppingListCategory1.code !== ItemShoppingListCategoryHelper.unknownCode &&
            itemShoppingListCategory2.code === ItemShoppingListCategoryHelper.unknownCode
        ) {
            return -1;
        }
        
        return itemShoppingListCategory1.name.localeCompare(itemShoppingListCategory2.name);
    }
}
