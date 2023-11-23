import { MealDto } from "../dto/meal.dto";
import { Meal } from "../model/meal.model";

export abstract class MealConverter {
    public static fromDtoToModel(mealDto: MealDto): Meal {
        const meal = new Meal();
        meal.id = mealDto.id ?? -1;
        meal.familyId = mealDto.familyId;
        meal.name = mealDto.name;
        meal.date = mealDto.date;
        meal.numberOfPersons = mealDto.numberOfPersons;
        meal.mealKindId = mealDto.mealKindId;
        return meal;
    }

    public static fromModelToDto(meal: Meal): MealDto {
        const mealDto = new MealDto();
        mealDto.familyId = meal.familyId;
        mealDto.name = meal.name;
        mealDto.date = meal.date;
        mealDto.numberOfPersons = meal.numberOfPersons;
        mealDto.mealKindId = meal.mealKindId;
        return mealDto;
    }
}