import { MealKind } from "./meal-kind.model";

export class Meal {
    public id: number;
    public familyId: number;
    public name: string;
    public date: Date;
    public numberOfPersons: number;
    public mealKindId: number;
    
    public constructor() {
        this.id = -1;
        this.familyId = -1;
        this.name = '';
        this.date = new Date();
        this.numberOfPersons = 1;
        this.mealKindId = -1;
    }
}