import { TestBed } from '@angular/core/testing';
import { MealsByMealKindService } from './meals-by-meal-kind.service';
import { MealKindService } from './meal-kind.service';
import { MealService } from './meal.service';
import { MealsByMealKind } from '../model/meals-by-meal-kind.model';
import { of, lastValueFrom } from 'rxjs';
import { MealKind } from '../model/meal-kind.model';
import { Meal } from '../model/meal.model';
import { MockService } from 'ng-mocks';

describe('MealsByMealKindService', () => {
    let mealKindServiceMock: MealKindService;
    let mealServiceMock: MealService;
    let service: MealsByMealKindService;

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                providers: [
                    MealsByMealKindService,
                    { 
                        provide: MealKindService, useValue: MockService(MealKindService) 
                    },
                    {
                        provide: MealService, useValue: MockService(MealService)
                    }
                ] 
            }
        );

        mealKindServiceMock = TestBed.inject(MealKindService);
        mealServiceMock = TestBed.inject(MealService);
        service = TestBed.inject(MealsByMealKindService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should load all meals by date grouped by meal kind', async () => {
        const date: Date = new Date();
        const mealKind1: MealKind = new MealKind();
        mealKind1.id = 1;
        mealKind1.name = 'Petit-déjeuner';
        //mealKind1.position = 1;
        const mealKind2: MealKind = new MealKind();
        mealKind2.id = 2;
        mealKind2.name = 'Déjeuner';
        //mealKind2.position = 2;
        const mealKind3: MealKind = new MealKind();
        mealKind3.id = 3;
        mealKind3.name = 'Dîner';
        //mealKind3.position = 3;
        mealKindServiceMock.loadAll = () => of([mealKind2, mealKind3, mealKind1]);
        const meal1: Meal = new Meal();
        meal1.id = 1;
        meal1.mealKindId = 3;
        meal1.name = 'Omelette';
        const meal2: Meal = new Meal();
        meal2.id = 2;
        meal2.mealKindId = 1;
        meal2.name = 'Pain perdu';
        const meal3: Meal = new Meal();
        meal3.id = 3;
        meal3.mealKindId = 3;
        meal3.name = 'Frites';
        mealServiceMock.loadAllByDate = () => of([meal1, meal2, meal3]);

        const result: MealsByMealKind[] = await lastValueFrom(service.loadAllByDate(date));

        expect(result.length).toBe(2);
        expect(result[0].mealKind.id).toBe(3);
        expect(result[0].meals.length).toBe(2);
        expect(result[0].meals[0].name).toBe('Omelette');
        expect(result[0].meals[1].name).toBe('Frites');
        expect(result[1].mealKind.id).toBe(1);
        expect(result[1].meals.length).toBe(1);
        expect(result[1].meals[0].name).toBe('Pain perdu');
    });
});