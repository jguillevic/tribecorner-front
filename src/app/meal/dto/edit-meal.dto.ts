export class EditMealDto {
    public constructor(
        public readonly name: string,
        public readonly date: string,
        public readonly numberOfPersons: number,
        public readonly mealKindId: number
    ) { }
}