export class Meal {
    public constructor(
        public id: number,
        public name: string,
        public readonly date: Date,
        public readonly numberOfPersons: number,
        public readonly mealKindId: number
    ) { }
}