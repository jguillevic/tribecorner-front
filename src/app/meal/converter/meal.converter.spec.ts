import { MealConverter } from './meal.converter';
import { MealDto } from '../dto/load-meal.dto';
import { Meal } from '../model/meal.model';
import { DateHelper } from '../../common/date/helper/date.helper';

describe('MealConverter', () => {
    describe('fromDtoToModel', () => {
        it('should convert MealDto to Meal', () => {
            const mealDto: MealDto = {
                id: 1,
                name: 'Lunch',
                date: DateHelper.toISODate(new Date()),
                numberOfPersons: 4,
                mealKindId: 3,
            };

            const result: Meal = MealConverter.fromDtoToModel(mealDto);

            expect(result).toBeDefined();
            expect(result.id).toBe(mealDto.id);
            expect(result.name).toBe(mealDto.name);
            expect(result.date).toStrictEqual(new Date(mealDto.date));
            expect(result.numberOfPersons).toBe(mealDto.numberOfPersons);
            expect(result.mealKindId).toBe(mealDto.mealKindId);
        });
    });

    describe('fromModelToDto', () => {
        it('should convert Meal to MealDto', () => {
            const meal: Meal = {
                id: 1,
                name: 'Dinner',
                date: new Date(),
                numberOfPersons: 2,
                mealKindId: 2,
            };

            const result: MealDto = MealConverter.fromModelToDto(meal);

            expect(result).toBeDefined();
            expect(result.name).toBe(meal.name);
            expect(result.date).toBe(DateHelper.toISODate(meal.date));
            expect(result.numberOfPersons).toBe(meal.numberOfPersons);
            expect(result.mealKindId).toBe(meal.mealKindId);
        });
    });
});