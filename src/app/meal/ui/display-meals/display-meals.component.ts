import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileTopBarComponent } from "../../../common/top-bar/profile/ui/profile-top-bar.component";
import { TabBarComponent } from "../../../common/tab-bar/ui/tab-bar/tab-bar.component";
import { InlineCalendarComponent } from "../../../common/calendar/ui/inline-calendar/inline-calendar.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subject, switchMap, take } from 'rxjs';
import { Router } from '@angular/router';
import { MealRoutes } from '../../route/meal.routes';
import { MealsByMealKind } from '../../model/meals-by-meal-kind.model';
import { MealsByMealKindService } from '../../service/meals-by-meal-kind.service';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { LargeEmptyComponent } from "../../../common/empty/ui/large-empty/large-empty.component";
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { MealCurrentDateService } from '../../service/meal-current-date.service';
import { LargeMealCardComponent } from "../large-meal-card/large-meal-card.component";
import { MealEditButtonComponent } from "../meal-edit-button/meal-edit-button.component";
import { MealDeleteButtonComponent } from "../meal-delete-button/meal-delete-button.component";
import { Meal } from '../../model/meal.model';
import { MealCopyButtonComponent } from "../meal-copy-button/meal-copy-button.component";

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
        MtxButtonModule,
        LargeMealCardComponent,
        MealEditButtonComponent,
        MealDeleteButtonComponent,
        MealCopyButtonComponent
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
  = this.getMealsByMealKinds$();

  public constructor(
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

  private getMealsByMealKinds$(): Observable<MealsByMealKind[]> {
    return this.selectedDate$
    .pipe(
      switchMap(date => this.mealsByMealKindService.loadAllByDate(date))
    );
  }

  public onMealDeleted(deletedMeal: Meal) {
    // this.deletedEventsSubject.next(
    //   [
    //     ...this.deletedEventsSubject.value,
    //     deletedEvent
    //   ]
    // );
    this.mealsByMealKinds$ = this.getMealsByMealKinds$();
  }

  public onMealCopied(copiedMeal: Meal) {
    // this.addedShoppingListsSubject.next(
    //   [
    //     ...this.addedShoppingListsSubject.value,
    //     copiedShoppingList
    //   ]
    // );
    this.mealsByMealKinds$ = this.getMealsByMealKinds$();
  }
}