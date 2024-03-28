import { Injectable } from '@angular/core';
import { MealKindService } from './meal-kind.service';
import { MealService } from './meal.service';
import { MealsByMealKind } from '../model/meals-by-meal-kind.model';
import { Observable, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MealsByMealKindService {

  public constructor(
    private mealKindService: MealKindService,
    private mealService: MealService
  ) { }
  
  public loadAllByDate(date: Date): Observable<MealsByMealKind[]> {
    return combineLatest({
      mealKinds: this.mealKindService.mealKinds$,
      meals: this.mealService.getMealsByDate(date)
    })
    .pipe(
      map(result => 
        result.mealKinds
        .filter(mealKind => 
          result.meals
          .filter(meal => meal.mealKindId === mealKind.id).length
        )
        .map(mealKind => 
          new MealsByMealKind(
            mealKind,
            result.meals
            .filter(meal => meal.mealKindId === mealKind.id)
            .sort((a, b) => {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();
          
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1
              }
          
              return 0;
            })
          )
        )
      )
    );
  }
}