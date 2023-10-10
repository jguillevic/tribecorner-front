import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Meal } from '../model/meal.model';
import { MealKindService } from './meal-kind.service';

@Injectable()
export class MealService {

  public constructor(private mealKindService: MealKindService) { }

  public loadAllByDate(date: Date): Observable<Meal[]> {
    return this.mealKindService.loadAll()
      .pipe(
        switchMap((mealKinds) => {
          const meals: Meal[] = [];

          if (date.setHours(0,0,0,0) == new Date().setHours(0,0,0,0)) {
            meals.push(new Meal());
            meals[0].id = 1;
            meals[0].date = date;
            meals[0].mealKindId = mealKinds[0].id;
            meals[0].name = 'Pain perdu';
            meals[0].numberOfPersons = 3;
          }

          return of(meals);
        })
      );
  }

  public loadOneById(mealId: number): Observable<Meal>
  {
    const meal = new Meal();

    meal.date = new Date('2023-10-12');
    meal.familyId = 1;
    meal.mealKindId = 1;
    meal.name = 'Mon repas de test';
    meal.numberOfPersons = 6;

    return of(meal);
  }

  public create(meal: Meal): Observable<Meal|undefined> {
    return of(undefined);
  }

  public update(meal: Meal): Observable<Meal|undefined> {
    return of(undefined);
  }
}
