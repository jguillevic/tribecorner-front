import { MealKindDto } from "../dto/meal-kind.dto";
import { MealKind } from "../model/meal-kind.model";

export class MealKindConverter {
    public fromDtoToModel(mealKindDto: MealKindDto): MealKind {
        const mealKind = new MealKind();
        mealKind.id = mealKindDto.id;
        mealKind.name = mealKindDto.name;
        return mealKind;
    }
}