import {ItemShoppingListCategoryDto} from "./item-shopping-list-category.dto";

export class SuggestedItemShoppingListDto {
    public constructor(
        public readonly name: string,
        public readonly category: ItemShoppingListCategoryDto,
        public readonly count: number
    ) { }
}