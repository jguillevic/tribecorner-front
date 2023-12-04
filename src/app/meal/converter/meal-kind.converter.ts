import { MealKindDto } from "../dto/meal-kind.dto";
import { MealKind } from "../model/meal-kind.model";

export abstract class MealKindConverter {
    public static fromDtoToModel(mealKindDto: MealKindDto): MealKind {
        return new MealKind(
            mealKindDto.id,
            mealKindDto.name,
            mealKindDto.position
        );
    }
}