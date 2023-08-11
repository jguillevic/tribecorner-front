export class ItemShoppingList {
    id: number;
    name: string;
    isChecked: boolean;
    position: number;

    constructor() {
        this.id = -1;
        this.name = '';
        this.isChecked = false;
        this.position = -1;
    }
}