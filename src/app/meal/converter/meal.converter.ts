import { DateHelper } from "../../common/date/helper/date.helper";
import { EditMealDto } from "../dto/edit-meal.dto";
import { LoadMealDto } from "../dto/load-meal.dto";
import { Meal } from "../model/meal.model";

export abstract class MealConverter {
    public static fromDtoToModel(loadMealDto: LoadMealDto): Meal {
        return new Meal(
            loadMealDto.id,
            loadMealDto.name,
            new Date(loadMealDto.date),
            loadMealDto.numberOfPersons,
            loadMealDto.mealKindId
        );
    }

    public static fromModelToDto(meal: Meal): EditMealDto {
        return new EditMealDto(
            meal.name,
            DateHelper.toISODate(meal.date),
            meal.numberOfPersons,
            meal.mealKindId
        );
    }
}