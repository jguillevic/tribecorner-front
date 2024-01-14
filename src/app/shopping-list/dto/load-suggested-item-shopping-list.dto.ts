export class LoadSuggestedItemShoppingListDto {
    public constructor(
        public readonly name: string,
        public readonly count: number
    ) { }
}