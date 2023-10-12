import { MealDto } from "../dto/meal.dto";
import { Meal } from "../model/meal.model";

export class MealConverter {
    public fromDtoToModel(mealDto: MealDto): Meal {
        const meal = new Meal();
        meal.id = mealDto.id;
        meal.familyId = mealDto.familyId;
        meal.name = mealDto.name;
        meal.date = mealDto.date;
        meal.numberOfPersons = mealDto.numberOfPersons;
        meal.mealKindId = mealDto.mealKindId;
        return meal;
    }

    public formModelToDto(meal: Meal): MealDto {
        const mealDto = new Meal();
        mealDto.id = meal.id;
        mealDto.familyId = meal.familyId;
        mealDto.name = meal.name;
        mealDto.date = meal.date;
        mealDto.numberOfPersons = meal.numberOfPersons;
        mealDto.mealKindId = meal.mealKindId;
        return mealDto;
    }
}