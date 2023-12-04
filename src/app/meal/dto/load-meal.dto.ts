export class LoadMealDto {
    public readonly id: number;
    public readonly name: string;
    public readonly date: string;
    public readonly numberOfPersons: number;
    public readonly mealKindId: number;

    public constructor(
        id: number,
        name: string,
        date: string,
        numberOfPersons: number,
        mealKindId: number
    ) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.numberOfPersons = numberOfPersons;
        this.mealKindId = mealKindId;
    }
}