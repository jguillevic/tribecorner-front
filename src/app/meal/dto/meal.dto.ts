export class MealDto {
    public constructor(
        public readonly id: number|undefined,
        public readonly name: string,
        public readonly date: string,
        public readonly numberOfPersons: number,
        public readonly mealKindId: number,
        public readonly recipeUrl: string|undefined = undefined
    ) { }
}