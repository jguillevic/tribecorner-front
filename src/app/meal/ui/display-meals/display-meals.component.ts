import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileTopBarComponent } from "../../../common/top-bar/profile/ui/profile-top-bar.component";
import { TabBarComponent } from "../../../common/tab-bar/ui/tab-bar/tab-bar.component";
import { Meal } from '../../model/meal.model';
import { InlineCalendarComponent } from "../../../common/calendar/ui/inline-calendar/inline-calendar.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MealService } from '../../service/meal.service';
import { Observable, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MealRoutes } from '../../route/meal.routes';
import { MealsByMealKind } from '../../model/meals-by-meal-kind.model';
import { MealsByMealKindService } from '../../service/meals-by-meal-kind.service';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { LargeEmptyComponent } from "../../../common/empty/ui/large-empty/large-empty.component";
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { MealCurrentDateService } from '../../service/meal-current-date.service';

@Component({
    selector: 'app-display-meals',
    standalone: true,
    templateUrl: './display-meals.component.html',
    styleUrls: ['display-meals.component.scss'],
    imports: [
        CommonModule,
        ProfileTopBarComponent,
        TabBarComponent,
        InlineCalendarComponent,
        MatIconModule,
        MatButtonModule,
        SimpleLoadingComponent,
        LargeEmptyComponent,
        MtxButtonModule
    ]
})
export class DisplayMealsComponent implements OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  private readonly selectedDate$: Observable<Date> = this.mealCurrentDateService.currentDate$;
  public readonly defaultDate$: Observable<Date> = this.selectedDate$
  .pipe(
    take(1)
  );

  public mealsByMealKinds$: Observable<MealsByMealKind[]> 
  = this.getMealsByMealKinds$()

  public constructor(
    private mealService: MealService,
    private mealsByMealKindService: MealsByMealKindService,
    private mealCurrentDateService: MealCurrentDateService,
    private router: Router
  ) { }

  public ngOnDestroy(): void {
    this.destroy$.complete();
  }

  public onSelectedDateChanged(date: Date) {
    this.mealCurrentDateService.selectDate(date);
  }

  public goToCreate(): Promise<boolean> {
    return this.router.navigate([MealRoutes.editMealRoute]);
  }

  public goToUpdate(mealId: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      resolve(this.router.navigate([MealRoutes.editMealRoute], { queryParams: { id: mealId } }));
    }); 
  }

  public getMealsByMealKinds$(): Observable<MealsByMealKind[]> {
    return this.selectedDate$
    .pipe(
      switchMap(date => this.mealsByMealKindService.loadAllByDate(date))
    );
  } 

  public delete(meal: Meal): void {
    this.mealService
    .delete(meal.id)
    .pipe(
      takeUntil(this.destroy$),
      tap(() => this.mealsByMealKinds$ = this.getMealsByMealKinds$())
    )
    .subscribe();
  }
}