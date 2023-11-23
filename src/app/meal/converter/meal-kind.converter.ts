import { MealKindDto } from "../dto/meal-kind.dto";
import { MealKind } from "../model/meal-kind.model";

export abstract class MealKindConverter {
    public static fromDtoToModel(mealKindDto: MealKindDto): MealKind {
        const mealKind = new MealKind();
        mealKind.id = mealKindDto.id;
        mealKind.name = mealKindDto.name;
        mealKind.position = mealKindDto.position;
        return mealKind;
    }
}