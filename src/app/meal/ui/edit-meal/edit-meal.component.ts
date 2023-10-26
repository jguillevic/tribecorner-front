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
import { EditTopBarComponent } from "../../../common/top-bar/edit/ui/edit-top-bar/edit-top-bar.component";
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
        EditTopBarComponent,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule
    ],
})
export class EditMealComponent implements OnInit, OnDestroy {
  private currentAction: Action = Action.create;
  private currentMealId: number|undefined;
  private currentFamilyId: number|undefined;
  private initMealSubscription: Subscription|undefined;
  private loadMealKindsSubscription: Subscription|undefined;

  public loadedMealKinds: MealKind[] = [];
  public readonly numbersOfPersons: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  public isSaving: boolean = false;

  // Formulaire.
  public readonly mealNameMaxLength: number = 255; 

  public readonly editMealForm: FormGroup = new FormGroup(
    {
      mealKindId: new FormControl(undefined, [Validators.required]),
      mealName: new FormControl(undefined, [Validators.required, Validators.maxLength(this.mealNameMaxLength)]),
      mealDate: new FormControl(undefined, [Validators.required]),
      mealNumberOfPersons: new FormControl(undefined, [Validators.required])
    }
  );

  public constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private mealKindService: MealKindService,
    private mealService: MealService
    ) {
  }

  public ngOnInit(): void {
    this.initMealSubscription = this.activatedRoute.queryParams
    .pipe(
      switchMap((params: Params) => {
        this.currentAction = params['action'];
        const defaultDate = params['defaultDate'];

        if (this.currentAction == Action.create) {
          const meal: Meal = new Meal();
          meal.date = new Date(defaultDate);
          meal.numberOfPersons = 3;
          const currentUserInfo: UserInfo|undefined = this.userService.getCurrentUserInfo();
          if (currentUserInfo?.familyId) {
            meal.familyId = currentUserInfo?.familyId;
          }
          return of(meal);
        } else if (this.currentAction == Action.update) {
          this.currentMealId = params['id'];
          if (this.currentMealId) {
            return this.mealService.loadOneById(this.currentMealId);
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
        this.currentFamilyId = meal.familyId;
      }
    });

    this.loadMealKindsSubscription = this.mealKindService
    .loadAll()
    .subscribe(mealKinds => this.loadedMealKinds = mealKinds);
  }

  public ngOnDestroy(): void {
    this.initMealSubscription?.unsubscribe();
    this.loadMealKindsSubscription?.unsubscribe();
  }

  private getMeal(): Meal {
    const meal: Meal = new Meal();

    if (this.currentMealId) {
      meal.id = this.currentMealId;
    }
    if (this.currentFamilyId) {
      meal.familyId = this.currentFamilyId;
    }
    meal.mealKindId = this.editMealForm.controls['mealKindId'].value;
    meal.name = this.editMealForm.controls['mealName'].value;
    meal.date = this.editMealForm.controls['mealDate'].value;
    meal.numberOfPersons = this.editMealForm.controls['mealNumberOfPersons'].value;

    return meal;
  }

  private save(): Observable<Meal|undefined> {
    const meal: Meal = this.getMeal();

    if (this.currentAction == Action.update) {
      return this.mealService.update(meal);
    } else if (this.currentAction == Action.create) {
      return this.mealService.create(meal);
    }

    return of(undefined);
  }

  private handleError(error: any): void {
    this.isSaving = false;
    window.alert("Problème technique. Veuillez réessayer dans quelques minutes.");
  }

  public goToDisplayMeals(): Promise<boolean> {
    const date: Date = this.editMealForm.controls['mealDate'].value;

    return this.router.navigate(
      [MealRoutes.displayMealsRoute],
      { queryParams: { defaultSelectedDate: moment(date).format("YYYY-MM-DD") } }
      );
  }

  public editMeal(): void {
    // Pour forcer l'apparition des erreurs.
    this.editMealForm.markAllAsTouched();
    if (this.editMealForm.valid) {
      this.isSaving = true;
      this.save().subscribe({ 
        next: () => this.goToDisplayMeals(),
        error: (error) => this.handleError(error)
      });
    }
  }

  public isCreating(): boolean {
    return this.currentAction == Action.create;
  }
}