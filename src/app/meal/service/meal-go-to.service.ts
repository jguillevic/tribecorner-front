import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { MealRoutes } from '../route/meal.routes';

@Injectable({
  providedIn: 'root',
})
export class MealGoToService {
    public constructor(
        private router: Router
    ) { }

    public goToCreate(): Observable<boolean> {
        return from(this.router.navigate([MealRoutes.editMealRoute]));
    }

    public goToUpdate(mealId: number|undefined): Observable<boolean> {
        return from(this.router.navigate([MealRoutes.editMealRoute], { queryParams: { id: mealId } }));
    }
}
