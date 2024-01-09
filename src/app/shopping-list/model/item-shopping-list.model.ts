export class ItemShoppingList {
    public constructor(
        public id: number|undefined,
        public name: string = '',
        public shoppingListId: number,
        public isChecked: boolean = false,
        public position: number = 0
    ) { }
}