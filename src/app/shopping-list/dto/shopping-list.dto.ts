import {ItemShoppingListDto} from "./item-shopping-list.dto";

export class ShoppingListDto {
    public constructor(
        public id: number|undefined,
        public name: string,
        public isArchived: boolean,
        public items: ItemShoppingListDto[]
    ) { }
}