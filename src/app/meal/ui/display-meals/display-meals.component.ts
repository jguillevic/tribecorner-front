import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileTopBarComponent } from "../../../common/top-bar/profile/ui/profile-top-bar.component";
import { TabBarComponent } from "../../../common/tab-bar/ui/tab-bar/tab-bar.component";
import { Meal } from '../../model/meal.model';
import { InlineCalendarComponent } from "../../../common/calendar/ui/inline-calendar/inline-calendar.component";
import { MealKind } from '../../model/meal-kind.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MealService } from '../../service/meal.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MealRoutes } from '../../route/meal.routes';
import { MealKindService } from '../../service/meal-kind.service';

@Component({
    selector: 'app-display-meals',
    standalone: true,
    templateUrl: './display-meals.component.html',
    styles: [],
    imports: [
      CommonModule,
      ProfileTopBarComponent,
      TabBarComponent,
      InlineCalendarComponent,
      MatIconModule,
      MatButtonModule
    ]
})
export class DisplayMealsComponent implements OnInit, OnDestroy {
  private loadAllMealsByDateSubscriptions: Subscription[] = [];
  private loadAllMealKindsSubscription: Subscription|undefined;
  private loadedMealKinds: MealKind[] = [];

  public mealsGroupByMealKinds: Map<number, Meal[]> = new Map<number, Meal[]>;
  public mealKinds: MealKind[] = [];

  public constructor(
    private mealKindService: MealKindService,
    private mealService: MealService,
    private router: Router
    ) { }

  public ngOnInit(): void {
    this.loadAllMealKindsSubscription = this.mealKindService
    .loadAll()
    .subscribe(mealKinds => this.loadedMealKinds = mealKinds);
  }

  public ngOnDestroy(): void {
    this.loadAllMealKindsSubscription?.unsubscribe();
    this.loadAllMealsByDateSubscriptions?.forEach(
      loadAllMealsByDateSubscriptions => {
        loadAllMealsByDateSubscriptions.unsubscribe()
      }
    );
  }

  public onSelectedDateChanged(date: Date) {
    this.loadAllMealsByDateSubscriptions
    .push(this.mealService
      .loadAllByDate(date)
      .subscribe((meals) => {
        this.mealsGroupByMealKinds?.clear();
        meals.forEach((meal) => {
          if (!this.mealsGroupByMealKinds.has(meal.mealKindId)) {
            this.mealsGroupByMealKinds.set(meal.mealKindId, []);
          }
          this.mealsGroupByMealKinds.get(meal.mealKindId)?.push(meal);
        });
        this.mealKinds = [];
        Array.from(this.mealsGroupByMealKinds.keys())
        .forEach((mealKindId) => {
          const mealKind = this.loadedMealKinds.find(item => item.id == mealKindId);
          if (mealKind) {
            this.mealKinds.push(mealKind);
          }
        });
      })
    );
  }

  public goToCreate(): Promise<boolean> {
    return this.router.navigate([MealRoutes.editMealRoute], { queryParams: { action: 'create' } });
  }

  public goToUpdate(mealId: number|undefined): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (mealId) {
        resolve(this.router.navigate([MealRoutes.editMealRoute], { queryParams: { action: 'update', id: mealId } }));
      } else {
        reject(false);
      }
    }); 
  }
}