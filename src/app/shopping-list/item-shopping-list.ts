export class ItemShoppingList {
    id: number;
    name: string;
    isChecked: boolean;

    constructor() {
        this.id = -1;
        this.name = '';
        this.isChecked = false;
    }
}