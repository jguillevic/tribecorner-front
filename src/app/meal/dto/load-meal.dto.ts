export class LoadMealDto {
    public constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly date: string,
        public readonly numberOfPersons: number,
        public readonly mealKindId: number
    ) { }
}