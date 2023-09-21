import { LoadItemShoppingListDto } from "./load-item-shopping-list.dto";

export class LoadShoppingListDto {
    public id: number;
    public name: string;
    public familyId: number;
    public items: LoadItemShoppingListDto[];

    constructor() {
        this.id = -1;
        this.name = "";
        this.familyId = -1;
        this.items = [];
    }
}