import { LoadItemShoppingListDto } from "./load-item-shopping-list.dto";

export class LoadShoppingListDto {
    public id: number;
    public name: string;
    public isArchived: boolean;
    public items: LoadItemShoppingListDto[];

    constructor() {
        this.id = -1;
        this.name = "";
        this.isArchived = false;
        this.items = [];
    }
}