import { EditItemShoppingListDto } from "./edit-item-shopping-list.dto";

export class EditShoppingListDto {
    public id: number|undefined;
    public name: string;
    public isArchived: boolean;
    public items: EditItemShoppingListDto[];

    constructor() {
        this.name = "";
        this.isArchived = false;
        this.items = [];
    }
}