import { ItemShoppingListCategoryDto } from "./item-shopping-list-category.dto";

export class LoadItemShoppingListDto {
    public constructor(
        public id: number,
        public name: string,
        public category: ItemShoppingListCategoryDto,
        public shoppingListId: number,
        public isChecked: boolean,
        public position: number
    ) { }
}