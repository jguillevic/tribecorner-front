export class MealDto {
    public id: number|undefined;
    public familyId: number|undefined;
    public name: string;
    public date: Date;
    public numberOfPersons: number;
    public mealKindId: number;

    public constructor() {
        this.name = '';
        this.date = new Date();
        this.numberOfPersons = 1;
        this.mealKindId = -1;
    }
}