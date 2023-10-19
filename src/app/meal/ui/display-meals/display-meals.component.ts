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
import { Observable, Subscription, of, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MealRoutes } from '../../route/meal.routes';
import { MealKindService } from '../../service/meal-kind.service';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { UserService } from 'src/app/user/service/user.service';
import * as moment from 'moment';

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
  private deleteSubscription: Subscription|undefined;
  private loadedMealKinds: MealKind[] = [];
  private currentUserInfo: UserInfo|undefined;
  private selectedDate: Date|undefined;

  public mealsGroupByMealKinds: Map<number, Meal[]> = new Map<number, Meal[]>;
  public mealKinds: MealKind[] = [];
  public defaultSelectedDateObservable: Observable<Date>|undefined;

  public constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private mealKindService: MealKindService,
    private mealService: MealService,
    private router: Router
    ) { }

  public ngOnInit(): void {
    this.currentUserInfo = this.userService.getCurrentUserInfo();

    this.loadAllMealKindsSubscription = this.mealKindService
    .loadAll()
    .subscribe(mealKinds => this.loadedMealKinds = mealKinds);

    this.defaultSelectedDateObservable = this.activatedRoute.queryParams.pipe(
      switchMap(params => {
        if (params["defaultSelectedDate"]) {
          return of(new Date(params["defaultSelectedDate"]));
        } else {
          return of(new Date());
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.deleteSubscription?.unsubscribe();
    this.loadAllMealKindsSubscription?.unsubscribe();
    this.loadAllMealsByDateSubscriptions?.forEach(
      loadAllMealsByDateSubscriptions => {
        loadAllMealsByDateSubscriptions.unsubscribe()
      }
    );
  }

  public onSelectedDateChanged(date: Date) {
    this.selectedDate = date;
    this.mealKinds = [];
    this.mealsGroupByMealKinds?.clear();

    if (this.currentUserInfo && this.currentUserInfo.familyId) {
      this.loadAllMealsByDateSubscriptions
      .push(
        this.mealService
        .loadAllByDate(date, this.currentUserInfo.familyId)
        .subscribe(meals => {
          meals
          .forEach((meal) => {
            if (!this.mealsGroupByMealKinds.has(meal.mealKindId)) {
              this.mealsGroupByMealKinds.set(meal.mealKindId, []);
            }
            this.mealsGroupByMealKinds.get(meal.mealKindId)?.push(meal);
          });

          Array.from(this.mealsGroupByMealKinds.keys())
          .sort((mealKindId1, mealKindId2) => {
            const mealKind1 = this.loadedMealKinds.find(item => mealKindId1 == item.id);
            const mealKind2 = this.loadedMealKinds.find(item => mealKindId2 == item.id);

            if (mealKind1 && mealKind2) {
              return (mealKind1.position > mealKind2.position) ? 1 : -1;
            }
            return 0;
          })
          .forEach((mealKindId) => {
            const mealKind = this.loadedMealKinds.find(item => item.id == mealKindId);
            if (mealKind) {
              this.mealKinds.push(mealKind);
            }
          });
        })
      );
    }
  }

  public goToCreate(): Promise<boolean> {
    return this.router.navigate([MealRoutes.editMealRoute],
      { 
        queryParams: { 
          action: 'create',
          defaultDate: moment(this.selectedDate).format("YYYY-MM-DD") 
        } 
      });
  }

  public goToUpdate(mealId: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      resolve(this.router.navigate([MealRoutes.editMealRoute], { queryParams: { action: 'update', id: mealId } }));
    }); 
  }

  public delete(mealKindId: number, meal: Meal): void {
    this.deleteSubscription = this.mealService
    .delete(meal.id)
    .subscribe(() => {
      const meals: Meal[]|undefined = this.mealsGroupByMealKinds.get(mealKindId);
      if (meals) {
        const index: number = meals.indexOf(meal);
        meals.splice(index, 1);
        if (meals.length == 0) {
          this.mealsGroupByMealKinds.delete(mealKindId);
        }
      }
    });
  }
}