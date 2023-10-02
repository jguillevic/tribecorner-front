import { MealKind } from "./meal-kind.model";

export class Meal {
    public id: number|undefined;
    public name: string;
    public date: Date;
    public numberOfPersons: number;
    public mealKind: MealKind;

    public constructor() {
        this.name = '';
        this.date = new Date();
        this.numberOfPersons = 1;
        this.mealKind = new MealKind();
    }
}