import { EditItemShoppingListDto } from "./edit-item-shopping-list.dto";

export class EditShoppingListDto {
    public id: number|undefined;
    public name: string;
    public familyId: number;
    public items: EditItemShoppingListDto[];

    constructor() {
        this.name = "";
        this.familyId = -1;
        this.items = [];
    }
}