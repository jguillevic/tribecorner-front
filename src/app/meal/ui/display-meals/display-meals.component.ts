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
  private _loadAllMealsByDateSubscriptions: Subscription[] = [];
  private _loadAllMealKindsSubscription: Subscription|undefined;
  private _deleteSubscription: Subscription|undefined;
  private _loadedMealKinds: MealKind[] = [];
  private _currentUserInfo: UserInfo|undefined;
  private _selectedDate: Date|undefined;

  private _mealsGroupByMealKinds: Map<number, Meal[]> = new Map<number, Meal[]>;
  public get mealsGroupByMealKinds(): Map<number, Meal[]> {
    return this._mealsGroupByMealKinds;
  }
  public set mealsGroupByMealKinds(value: Map<number, Meal[]>) {
    this._mealsGroupByMealKinds = value;
  }

  private _mealKinds: MealKind[] = [];
  public get mealKinds(): MealKind[] {
    return this._mealKinds;
  }
  public set mealKinds(value: MealKind[]) {
    this._mealKinds = value;
  }

  private _defaultSelectedDateObservable: Observable<Date> | undefined;
  public get defaultSelectedDateObservable(): Observable<Date> | undefined {
    return this._defaultSelectedDateObservable;
  }
  public set defaultSelectedDateObservable(value: Observable<Date> | undefined) {
    this._defaultSelectedDateObservable = value;
  }

  public constructor(
    private _activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _mealKindService: MealKindService,
    private _mealService: MealService,
    private _router: Router
    ) { }

  public ngOnInit(): void {
    this._currentUserInfo = this._userService.getCurrentUserInfo();

    this._loadAllMealKindsSubscription = this._mealKindService
    .loadAll()
    .subscribe(mealKinds => this._loadedMealKinds = mealKinds);

    this.defaultSelectedDateObservable = this._activatedRoute.queryParams.pipe(
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
    this._deleteSubscription?.unsubscribe();
    this._loadAllMealKindsSubscription?.unsubscribe();
    this._loadAllMealsByDateSubscriptions?.forEach(
      loadAllMealsByDateSubscriptions => {
        loadAllMealsByDateSubscriptions.unsubscribe()
      }
    );
  }

  public onSelectedDateChanged(date: Date) {
    this._selectedDate = date;
    this.mealKinds = [];
    this.mealsGroupByMealKinds?.clear();

    if (this._currentUserInfo && this._currentUserInfo.familyId) {
      this._loadAllMealsByDateSubscriptions
      .push(
        this._mealService
        .loadAllByDate(date, this._currentUserInfo.familyId)
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
            const mealKind1 = this._loadedMealKinds.find(item => mealKindId1 == item.id);
            const mealKind2 = this._loadedMealKinds.find(item => mealKindId2 == item.id);

            if (mealKind1 && mealKind2) {
              return (mealKind1.position > mealKind2.position) ? 1 : -1;
            }
            return 0;
          })
          .forEach((mealKindId) => {
            const mealKind = this._loadedMealKinds.find(item => item.id == mealKindId);
            if (mealKind) {
              this.mealKinds.push(mealKind);
            }
          });
        })
      );
    }
  }

  public goToCreate(): Promise<boolean> {
    return this._router.navigate([MealRoutes.editMealRoute],
      { 
        queryParams: { 
          action: 'create',
          defaultDate: moment(this._selectedDate).format("YYYY-MM-DD") 
        } 
      });
  }

  public goToUpdate(mealId: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      resolve(this._router.navigate([MealRoutes.editMealRoute], { queryParams: { action: 'update', id: mealId } }));
    }); 
  }

  public delete(mealKindId: number, meal: Meal): void {
    this._deleteSubscription = this._mealService
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