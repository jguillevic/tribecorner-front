export class LoadItemShoppingListDto {
    public constructor(
        public id: number,
        public name: string,
        public shoppingListId: number,
        public isChecked: boolean,
        public position: number
    ) { }
}