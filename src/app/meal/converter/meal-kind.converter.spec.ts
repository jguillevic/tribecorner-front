import { MealKindConverter } from './meal-kind.converter';
import { LoadMealKindDto } from '../dto/load-meal-kind.dto';
import { MealKind } from '../model/meal-kind.model';

describe('MealKindConverter', () => {
    describe('fromDtoToModel', () => {
        it('should convert MealKindDto to MealKind', () => {
            const mealKindDto: LoadMealKindDto = {
                id: 1,
                name: 'Breakfast',
                position: 1,
            };

            const result: MealKind = MealKindConverter.fromDtoToModel(mealKindDto);

            expect(result).toBeDefined();
            expect(result.id).toBe(mealKindDto.id);
            expect(result.name).toBe(mealKindDto.name);
            expect(result.position).toBe(mealKindDto.position);
        });
    });
});