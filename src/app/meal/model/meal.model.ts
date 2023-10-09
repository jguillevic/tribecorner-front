import { MealKind } from "./meal-kind.model";

export class Meal {
    public id: number|undefined;
    public name: string;
    public date: Date;
    public numberOfPersons: number;
    public mealKindId: number;
    public familyId: number;

    public constructor() {
        this.name = '';
        this.date = new Date();
        this.numberOfPersons = 1;
        this.mealKindId = -1;
        this.familyId = -1;
    }
}