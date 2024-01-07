export class ItemShoppingList {
    public constructor(
        public id: number|undefined,
        public name: string = '',
        public isChecked: boolean = false,
        public position: number = 0
    ) { }
}