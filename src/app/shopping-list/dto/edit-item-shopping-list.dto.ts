import { ItemShoppingListCategoryDto } from "./item-shopping-list-category.dto";

export class EditItemShoppingListDto {
    public constructor(
        public id: number|undefined,
        public name: string,
        public category: ItemShoppingListCategoryDto,
        public shoppingListId: number,
        public isChecked: boolean,
        public position: number,
    ) { }
}