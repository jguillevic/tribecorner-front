import { MealKind } from "./meal-kind.model";
import { Meal } from "./meal.model";

export class MealsByMealKind {
    public mealKind: MealKind;
    public meals: Meal[] = [];

    public constructor(mealKind: MealKind, meals: Meal[]) {
        this.mealKind = mealKind;
        this.meals = meals;
    }
}