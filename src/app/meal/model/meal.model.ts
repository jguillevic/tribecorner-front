export class Meal {
    public constructor(
        public id: number,
        public readonly name: string,
        public readonly date: Date,
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