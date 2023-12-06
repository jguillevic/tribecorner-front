export class EditMealDto {
    public constructor(
        public readonly name: string,
        public readonly date: string,
        public readonly numberOfPersons: number,
        public readonly mealKindId: number
    ) {
        this.name = name;
        this.date = date;
        this.numberOfPersons = numberOfPersons;
        this.mealKindId = mealKindId;
    }
}