export class LoadMealDto {
    public constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly date: string,
        public readonly numberOfPersons: number,
        public readonly mealKindId: number
    ) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.numberOfPersons = numberOfPersons;
        this.mealKindId = mealKindId;
    }
}