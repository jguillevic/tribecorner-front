export class EditMealDto {
    public readonly name: string;
    public readonly date: string;
    public readonly numberOfPersons: number;
    public readonly mealKindId: number;

    public constructor(
        name: string,
        date: string,
        numberOfPersons: number,
        mealKindId: number
    ) {
        this.name = name;
        this.date = date;
        this.numberOfPersons = numberOfPersons;
        this.mealKindId = mealKindId;
    }
}