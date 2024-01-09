export class EditItemShoppingListDto {
    public constructor(
        public id: number|undefined,
        public name: string,
        public shoppingListId: number,
        public isChecked: boolean,
        public position: number,
    ) { }
}