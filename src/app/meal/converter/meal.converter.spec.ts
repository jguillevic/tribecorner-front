import { MealConverter } from './meal.converter';
import { MealDto } from '../dto/meal.dto';
import { Meal } from '../model/meal.model';

describe('MealConverter', () => {
    describe('fromDtoToModel', () => {
        it('should convert MealDto to Meal', () => {
            const mealDto: MealDto = {
                id: 1,
                familyId: 10,
                name: 'Lunch',
                date: new Date(),
                numberOfPersons: 4,
                mealKindId: 3,
            };

            const result: Meal = MealConverter.fromDtoToModel(mealDto);

            expect(result).toBeDefined();
            expect(result.id).toBe(mealDto.id ?? -1);
            expect(result.familyId).toBe(mealDto.familyId);
            expect(result.name).toBe(mealDto.name);
            expect(result.date).toBe(mealDto.date);
            expect(result.numberOfPersons).toBe(mealDto.numberOfPersons);
            expect(result.mealKindId).toBe(mealDto.mealKindId);
        });
    });

    describe('fromModelToDto', () => {
        it('should convert Meal to MealDto', () => {
            const meal: Meal = {
                id: 1,
                familyId: 10,
                name: 'Dinner',
                date: new Date(),
                numberOfPersons: 2,
                mealKindId: 2,
            };

            const result: MealDto = MealConverter.fromModelToDto(meal);

            expect(result).toBeDefined();
            expect(result.familyId).toBe(meal.familyId);
            expect(result.name).toBe(meal.name);
            expect(result.date).toBe(meal.date);
            expect(result.numberOfPersons).toBe(meal.numberOfPersons);
            expect(result.mealKindId).toBe(meal.mealKindId);
        });
    });
});