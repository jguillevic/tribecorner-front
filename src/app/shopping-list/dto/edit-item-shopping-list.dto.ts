export class EditItemShoppingListDto {
    public id: number|undefined;
    public name: string;
    public isChecked: boolean;
    public position: number;

    constructor() {
        this.name = "";
        this.isChecked = false;
        this.position = -1;
    }
}