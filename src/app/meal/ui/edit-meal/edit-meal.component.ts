import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal } from '../../model/meal.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import * as moment from 'moment';

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
        CloseTopBarComponent,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule
    ],
})
export class EditMealComponent implements OnInit, OnDestroy {
  private _currentAction: Action = Action.create;
  private _currentMealId: number|undefined;
  private _currentFamilyId: number|undefined;
  private _initMealSubscription: Subscription|undefined;
  private _loadMealKindsSubscription: Subscription|undefined;

  private _loadedMealKinds: MealKind[] = [];
  public get loadedMealKinds(): MealKind[] {
    return this._loadedMealKinds;
  }
  public set loadedMealKinds(value: MealKind[]) {
    this._loadedMealKinds = value;
  }

  private readonly _numbersOfPersons: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  public get numbersOfPersons(): number[] {
    return this._numbersOfPersons;
  }

  private _isSaving: boolean = false;
  public get isSaving(): boolean {
    return this._isSaving;
  }
  public set isSaving(value: boolean) {
    this._isSaving = value;
  }

  // Formulaire.
  private readonly _mealNameLength: number = 255; 
  public get mealNameMaxLength(): number {
    return this._mealNameLength;
  }

  private readonly _editMealForm: FormGroup = new FormGroup(
    {
      mealKindId: new FormControl(undefined, [Validators.required]),
      mealName: new FormControl(undefined, [Validators.required, Validators.maxLength(this.mealNameMaxLength)]),
      mealDate: new FormControl(undefined, [Validators.required]),
      mealNumberOfPersons: new FormControl(undefined, [Validators.required])
    }
  );
  public get editMealForm(): FormGroup {
    return this._editMealForm;
  }

  public constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private mealKindService: MealKindService,
    private mealService: MealService
    ) {
  }

  public ngOnInit(): void {
    this._initMealSubscription = this.activatedRoute.queryParams
    .pipe(
      switchMap((params: Params) => {
        this._currentAction = params['action'];
        const defaultDate = params['defaultDate'];

        if (this._currentAction == Action.create) {
          const meal: Meal = new Meal();
          meal.date = new Date(defaultDate);
          meal.numberOfPersons = 3;
          const currentUserInfo: UserInfo|undefined = this.userService.getCurrentUserInfo();
          if (currentUserInfo?.familyId) {
            meal.familyId = currentUserInfo?.familyId;
          }
          return of(meal);
        } else if (this._currentAction == Action.update) {
          this._currentMealId = params['id'];
          if (this._currentMealId) {
            return this.mealService.loadOneById(this._currentMealId);
          }
        }
        return of(undefined);
      })
    )
    .subscribe(meal => {
      if (meal) {
        this.editMealForm.controls['mealName'].setValue(meal.name);
        this.editMealForm.controls['mealDate'].setValue(meal.date);
        if (meal.mealKindId > 0) {
          this.editMealForm.controls['mealKindId'].setValue(meal.mealKindId);
        }
        if (meal.numberOfPersons > 0) {
          this.editMealForm.controls['mealNumberOfPersons'].setValue(meal.numberOfPersons);
        }
        this._currentFamilyId = meal.familyId;
      }
    });

    this._loadMealKindsSubscription = this.mealKindService
    .loadAll()
    .subscribe(mealKinds => this.loadedMealKinds = mealKinds);
  }

  public ngOnDestroy(): void {
    this._initMealSubscription?.unsubscribe();
    this._loadMealKindsSubscription?.unsubscribe();
  }

  private getMeal(): Meal {
    const meal: Meal = new Meal();
    if (this._currentMealId) {
      meal.id = this._currentMealId;
    }
    if (this._currentFamilyId) {
      meal.familyId = this._currentFamilyId;
    }
    meal.mealKindId = this.editMealForm.controls['mealKindId'].value;
    meal.name = this.editMealForm.controls['mealName'].value;
    meal.date = this.editMealForm.controls['mealDate'].value;
    meal.numberOfPersons = this.editMealForm.controls['mealNumberOfPersons'].value;

    return meal;
  }

  private save(): Observable<Meal|undefined> {
      const meal: Meal = this.getMeal();

      if (this._currentAction == Action.update) {
        return this.mealService.update(meal);
      } else if (this._currentAction == Action.create) {
        return this.mealService.create(meal);
      }

      return of(undefined);
  }

  private handleError(error: any): void {
    this.isSaving = false;
  }

  private goToDisplayMeals(): Promise<boolean> {
    const date: Date = this.editMealForm.controls['mealDate'].value;

    return this.router.navigate(
      [MealRoutes.displayMealsRoute],
      { queryParams: { defaultSelectedDate: moment(date).format("YYYY-MM-DD") } }
      );
  }

  public editMeal(): void {
    if (this.editMealForm.valid) {
      this.isSaving = true;
      this.save().subscribe({ 
        next: () => this.goToDisplayMeals(),
        error: (error) => this.handleError(error)
      });
    }
  }

  public isCreating(): boolean {
    return this._currentAction == Action.create;
  }

  public closeClicked(): void {
    this.router.navigate([MealRoutes.displayMealsRoute]);
  }
}