import {ItemShoppingListCategoryDto} from "./item-shopping-list-category.dto";

export class ItemShoppingListDto {
    public constructor(
        public id: number|undefined,
        public name: string,
        public category: ItemShoppingListCategoryDto,
        public shoppingListId: number|undefined,
        public isChecked: boolean,
        public position: number
    ) { }
}