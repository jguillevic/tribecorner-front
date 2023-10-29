import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileTopBarComponent } from "../../../common/top-bar/profile/ui/profile-top-bar.component";
import { TabBarComponent } from "../../../common/tab-bar/ui/tab-bar/tab-bar.component";
import { Meal } from '../../model/meal.model';
import { InlineCalendarComponent } from "../../../common/calendar/ui/inline-calendar/inline-calendar.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MealService } from '../../service/meal.service';
import { BehaviorSubject, Observable, Subscription, map, of, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MealRoutes } from '../../route/meal.routes';
import * as moment from 'moment';
import { MealsByMealKind } from '../../model/meals-by-meal-kind.model';
import { MealsByMealKindService } from '../../service/meals-by-meal-kind.service';
import { Action } from 'src/app/common/action';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { LargeEmptyComponent } from "../../../common/empty/ui/large-empty/large-empty.component";

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
        MatButtonModule,
        SimpleLoadingComponent,
        LargeEmptyComponent
    ]
})
export class DisplayMealsComponent implements OnInit, OnDestroy {
  private deleteSubscription: Subscription|undefined;
  private selectedDate: Date = new Date();

  private defaultSelectedDateSubject: BehaviorSubject<Date> = new BehaviorSubject(new Date());
  public defaultSelectedDate$ = this.defaultSelectedDateSubject.asObservable();

  public mealsByMealKinds$: Observable<MealsByMealKind[]> 
  = this.mealsByMealKindService
  .loadAllByDate(this.selectedDate);

  public constructor(
    private activatedRoute: ActivatedRoute,
    private mealService: MealService,
    private mealsByMealKindService: MealsByMealKindService,
    private router: Router
    ) { }

  public ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(
      map(params => {
        if (params["defaultSelectedDate"]) {
          return new Date(params["defaultSelectedDate"]);
        } else {
          return new Date();
        }
      }),
      tap(date => this.defaultSelectedDateSubject.next(date))
    )
    .subscribe();
  }

  public ngOnDestroy(): void {
    this.deleteSubscription?.unsubscribe();
  }

  public onSelectedDateChanged(date: Date) {
    this.selectedDate = date;

    this.mealsByMealKinds$ = this.mealsByMealKindService.loadAllByDate(this.selectedDate);
  }

  public goToCreate(): Promise<boolean> {
    return this.router.navigate([MealRoutes.editMealRoute],
      { 
        queryParams: { 
          action: Action.create,
          defaultDate: moment(this.selectedDate).format("YYYY-MM-DD") 
        } 
      });
  }

  public goToUpdate(mealId: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      resolve(this.router.navigate([MealRoutes.editMealRoute], { queryParams: { action: Action.update, id: mealId } }));
    }); 
  }

  public delete(meal: Meal): void {
    this.deleteSubscription = this.mealService
    .delete(meal.id)
    .pipe(
      tap(() => this.mealsByMealKinds$ = this.mealsByMealKindService.loadAllByDate(this.selectedDate))
    )
    .subscribe();
  }
}