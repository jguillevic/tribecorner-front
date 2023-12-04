import { LoadMealKindDto } from "../dto/load-meal-kind.dto";
import { MealKind } from "../model/meal-kind.model";

export abstract class MealKindConverter {
    public static fromDtoToModel(loadMealKindDto: LoadMealKindDto): MealKind {
        return new MealKind(
            loadMealKindDto.id,
            loadMealKindDto.name,
            loadMealKindDto.position
        );
    }
}