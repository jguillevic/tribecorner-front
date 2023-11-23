import { DateHelperService } from "src/app/common/date/service/date-helper.service";
import { MealDto } from "../dto/meal.dto";
import { Meal } from "../model/meal.model";

export class MealConverter {
    public constructor(private dateHelperService: DateHelperService) {

    }

    public fromDtoToModel(mealDto: MealDto): Meal {
        const meal = new Meal(this.dateHelperService);
        meal.id = mealDto.id ?? -1;
        meal.familyId = mealDto.familyId;
        meal.name = mealDto.name;
        meal.date = mealDto.date;
        meal.numberOfPersons = mealDto.numberOfPersons;
        meal.mealKindId = mealDto.mealKindId;
        return meal;
    }

    public fromModelToDto(meal: Meal): MealDto {
        const mealDto = new MealDto(this.dateHelperService);
        mealDto.familyId = meal.familyId;
        mealDto.name = meal.name;
        mealDto.date = meal.date;
        mealDto.numberOfPersons = meal.numberOfPersons;
        mealDto.mealKindId = meal.mealKindId;
        return mealDto;
    }
}