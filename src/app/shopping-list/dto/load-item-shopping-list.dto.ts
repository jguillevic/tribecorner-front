export class LoadItemShoppingListDto {
    public id: number;
    public name: string;
    public isChecked: boolean;
    public position: number;

    constructor() {
        this.id = -1;
        this.name = "";
        this.isChecked = false;
        this.position = -1;
    }
}