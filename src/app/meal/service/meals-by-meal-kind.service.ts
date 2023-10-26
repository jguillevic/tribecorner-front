import { Injectable } from '@angular/core';
import { MealKindService } from './meal-kind.service';
import { MealService } from './meal.service';
import { MealsByMealKind } from '../model/meals-by-meal-kind.model';
import { Observable, combineLatest, mergeMap, of } from 'rxjs';
import { MealKind } from '../model/meal-kind.model';
import { Meal } from '../model/meal.model';

@Injectable()
export class MealsByMealKindService {

  public constructor(
    private mealKindService: MealKindService,
    private mealService: MealService
  ) { }
  
  public loadAllByDate(date: Date, familyId: number): Observable<MealsByMealKind[]> {
    return combineLatest({
      mealKinds: this.mealKindService.loadAll(),
      meals: this.mealService.loadAllByDate(date, familyId)
    })
    .pipe(
      mergeMap(result => {
        const mealKinds: MealKind[] = result.mealKinds;
        const meals: Map<number, Meal[]> = new Map<number, Meal[]>();
        result.meals.forEach(meal => {
          if (!meals.has(meal.mealKindId)) {
            meals.set(meal.mealKindId, []);
          }
          meals.get(meal.mealKindId)?.push(meal);
        });
        const mealsByMealKinds: MealsByMealKind[] = [];
        mealKinds.forEach(mealKind => {
          const mealsByMealKind: MealsByMealKind = new MealsByMealKind(mealKind, meals.get(mealKind.id) ?? []);
          mealsByMealKinds.push(mealsByMealKind);
        });
        return of(mealsByMealKinds);
      })
    );
  }
}