import { TestBed, fakeAsync, flush } from '@angular/core/testing';
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

    it('should load all meals by date grouped by meal kind', fakeAsync(() => {
        const date: Date = new Date();
        const mealKind1: MealKind 
        = new MealKind(1, 'Petit-déjeuner', 0);
        const mealKind2: MealKind 
        = new MealKind(2, 'Déjeuner', 1);
        const mealKind3: MealKind 
        = new MealKind(3, 'Dîner', 2);
        mealKindServiceMock.loadAll = () => of([mealKind2, mealKind3, mealKind1]);
        const meal1: Meal 
        = new Meal(1, 'Omelette', new Date(), 1, 3);
        const meal2: Meal 
        = new Meal(2, 'Pain perdu', new Date(), 1, 1);
        const meal3: Meal 
        = new Meal(3, 'Frites', new Date(), 1, 3);
        mealServiceMock.loadAllByDate = () => of([meal1, meal2, meal3]);

        service.loadAllByDate(date)
        .subscribe(
            (result: MealsByMealKind[]) => {
                expect(result.length).toBe(2);
                expect(result[0].mealKind.id).toBe(3);
                expect(result[0].meals.length).toBe(2);
                expect(result[0].meals[0].name).toBe('Omelette');
                expect(result[0].meals[1].name).toBe('Frites');
                expect(result[1].mealKind.id).toBe(1);
                expect(result[1].meals.length).toBe(1);
                expect(result[1].meals[0].name).toBe('Pain perdu');
            }
        );

        flush();
    }));
});