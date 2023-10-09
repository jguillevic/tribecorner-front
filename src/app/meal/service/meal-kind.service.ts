import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MealKind } from '../model/meal-kind.model';

@Injectable()
export class MealKindService {
  public constructor() { }

  public loadAll(): Observable<MealKind[]> {
    const mealKinds: MealKind[] = [];
    mealKinds.push(new MealKind());
    mealKinds[0].id = 1;
    mealKinds[0].name = 'Petit déjeuner';
    mealKinds.push(new MealKind());
    mealKinds[1].id = 2;
    mealKinds[1].name = 'Déjeuner';
    mealKinds.push(new MealKind());
    mealKinds[2].id = 3;
    mealKinds[2].name = 'Dîner';

    return of(mealKinds);
  }
}
