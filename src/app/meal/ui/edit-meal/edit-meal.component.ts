import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal } from '../../model/meal.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Action } from 'src/app/common/action';
import { MealService } from '../../service/meal.service';
import { Observable, Subscription, of, switchMap } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MealRoutes } from '../../route/meal.routes';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { UserService } from 'src/app/user/service/user.service';
import { MatSelectModule } from '@angular/material/select';
import { MealKindService } from '../../service/meal-kind.service';
import { MealKind } from '../../model/meal-kind.model';
import { ButtonWithSpinnerDirective } from 'src/app/common/button/directive/button-with-spinner.directive';
import { CloseTopBarComponent } from "../../../common/top-bar/close/ui/close-top-bar/close-top-bar.component";

@Component({
    selector: 'app-edit-meal',
    standalone: true,
    templateUrl: './edit-meal.component.html',
    styles: [],
    imports: [
        CommonModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        MatSelectModule,
        ButtonWithSpinnerDirective,
        CloseTopBarComponent
    ]
})
export class EditMealComponent implements OnInit, OnDestroy {
  private currentAction: Action = Action.create;
  private initMealSubscription: Subscription|undefined;
  private loadMealKindsSubscription: Subscription|undefined;

  public meal: Meal|undefined;
  public loadedMealKinds: MealKind[] = [];
  public numbersOfPersons: number[] = [ 1, 2, 3, 4, 5, 6, 7, 8 ];
  public isSaving: boolean = false;

  public constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private mealKindService: MealKindService,
    private mealService: MealService
    ) { }

  public ngOnInit(): void {
    this.initMealSubscription = this.activatedRoute.queryParams
    .pipe(
      switchMap((params: Params) => {
        this.currentAction = params['action'];

        if (this.currentAction == Action.create) {
          const meal: Meal = new Meal();
          const currentUserInfo: UserInfo|undefined = this.userService.getCurrentUserInfo();
          if (currentUserInfo?.familyId) {
            meal.familyId = currentUserInfo?.familyId;
          }
          return of(meal);
        } else if (this.currentAction == Action.update) {
          const mealId: number = params['id'];
          return this.mealService.loadOneById(mealId);
        }
        return of(undefined);
      })
    )
    .subscribe(meal => {
      this.meal = meal;
    });

    this.loadMealKindsSubscription = this.mealKindService
    .loadAll()
    .subscribe(mealKinds => this.loadedMealKinds = mealKinds);
  }

  public ngOnDestroy(): void {
    this.initMealSubscription?.unsubscribe();
    this.loadMealKindsSubscription?.unsubscribe();
  }

  private save(): Observable<Meal|undefined> {
    if (this.meal) {
      if (this.currentAction == Action.update) {
        return this.mealService.update(this.meal);
      } else if (this.currentAction == Action.create) {
        return this.mealService.create(this.meal);
      } else {
        return of(undefined);
      }
    } else {
      return of(undefined);
    }
  }

  public editMeal(): void {
    this.isSaving = true;
    this.save().subscribe({ 
      next: () => {
        this.router.navigate([MealRoutes.displayMealsRoute]);
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }

  public isCreating(): boolean {
    return this.currentAction == Action.create;
  }

  public closeClicked(): void {
    this.router.navigate([MealRoutes.displayMealsRoute]);
  }
}