import {DateHelper} from "../../common/date/helper/date.helper";
import {MealDto} from "../dto/meal.dto";
import {Meal} from "../model/meal.model";

export abstract class MealConverter {
    public static fromDtoToModel(mealDto: MealDto): Meal {
        return new Meal(
            mealDto.id??0,
            mealDto.name,
            new Date(mealDto.date),
            mealDto.numberOfPersons,
            mealDto.mealKindId,
            mealDto.recipeUrl
        );
    }

    public static fromModelToDto(meal: Meal): MealDto {
        return new MealDto(
            undefined,
            meal.name,
            DateHelper.toISODate(meal.date),
            meal.numberOfPersons,
            meal.mealKindId,
            meal.recipeUrl
        );
    }
}