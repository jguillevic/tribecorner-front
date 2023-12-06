import { MealKind } from "./meal-kind.model";
import { Meal } from "./meal.model";

export class MealsByMealKind {
    public constructor(
        public readonly mealKind: MealKind, 
        public readonly meals: Meal[]
    ) {
        this.mealKind = mealKind;
        this.meals = meals;
    }
}