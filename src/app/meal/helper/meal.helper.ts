import { Meal } from "../model/meal.model";

export abstract class MealHelper {
    public static copy(mealToCopy: Meal, copyIds: boolean = true): Meal {
        return new Meal(
            copyIds ? mealToCopy.id : 0,
            mealToCopy.name,
            mealToCopy.date,
            mealToCopy.numberOfPersons,
            mealToCopy.mealKindId
        );
    }
}