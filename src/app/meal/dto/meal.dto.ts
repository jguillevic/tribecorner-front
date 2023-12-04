export class MealDto {
    public id: number|undefined;
    public familyId: number;
    public name: string;
    public date: string;
    public numberOfPersons: number;
    public mealKindId: number;

    public constructor() {
        this.familyId = 0;
        this.name = '';
        this.date = '';
        this.numberOfPersons = 1;
        this.mealKindId = -1;
    }
}