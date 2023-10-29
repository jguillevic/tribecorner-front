import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal } from '../../model/meal.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Action } from 'src/app/common/action';
import { MealService } from '../../service/meal.service';
import { Observable, Subscription, combineLatest, exhaustMap, map, mergeMap, of, shareReplay, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MealRoutes } from '../../route/meal.routes';
import { UserService } from 'src/app/user/service/user.service';
import { MatSelectModule } from '@angular/material/select';
import { MealKindService } from '../../service/meal-kind.service';
import { MealKind } from '../../model/meal-kind.model';
import { ButtonWithSpinnerDirective } from 'src/app/common/button/directive/button-with-spinner.directive';
import { EditTopBarComponent } from "../../../common/top-bar/edit/ui/edit-top-bar/edit-top-bar.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import * as moment from 'moment';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";

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
        ReactiveFormsModule,
        SimpleLoadingComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditMealComponent implements OnDestroy {
  private saveSubscription: Subscription|undefined;
  private currentMealId: number|undefined;

  public currentAction$ = this.activatedRoute.queryParams
  .pipe(
    map(params => params['action'] as string),
    shareReplay(1)
  );

  public isCreating$ = this.currentAction$
  .pipe(
    map(currentAction => {
      if (currentAction === Action.create) {
        return true;
      }
      return false;
    }),
    shareReplay(1)
  );

  private readonly mealKinds$: Observable<MealKind[]> 
  = this.mealKindService
  .loadAll();

  public readonly numbersOfPersons: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  public isSaving: boolean = false;

  // Formulaire.
  public readonly mealNameMaxLength: number = 255; 

  private editMealForm: FormGroup|undefined;
  private readonly editMealForm$: Observable<FormGroup> = this.activatedRoute.queryParams
  .pipe(
    mergeMap(params => {
      const currentAction = params['action'];   
      const defaultDate = params['defaultDate'];

      if (currentAction === Action.update) {
        this.currentMealId = params['id'];
        if (this.currentMealId) {
          return this.mealService.loadOneById(this.currentMealId);
        }
      }
      const meal: Meal = new Meal();
      meal.date = new Date(defaultDate);
      meal.numberOfPersons = 3;
      return of(meal);
    }),
    map(meal => {
      return new FormGroup(
        {
          mealKindId: new FormControl(meal.mealKindId ?? 0, [Validators.required]),
          mealName: new FormControl(meal.name, [Validators.required, Validators.maxLength(this.mealNameMaxLength)]),
          mealDate: new FormControl(meal.date, [Validators.required]),
          mealNumberOfPersons: new FormControl(meal.numberOfPersons ?? 3, [Validators.required])
        }
      );
    }),
    tap(editMealForm => this.editMealForm = editMealForm)
  );

  public readonly editMealFormData$ 
  = combineLatest({
    editMealForm: this.editMealForm$,
    mealKinds: this.mealKinds$
  })
  .pipe(
    tap(data => console.table(data))
  );

  public constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private mealKindService: MealKindService,
    private mealService: MealService
    ) {
  }
  
  public ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  private getMeal(): Meal {
    const meal: Meal = new Meal();

    if (this.currentMealId) {
      meal.id = this.currentMealId;
    }
    meal.mealKindId = this.editMealForm?.controls['mealKindId'].value;
    meal.name = this.editMealForm?.controls['mealName'].value;
    meal.date = this.editMealForm?.controls['mealDate'].value;
    meal.numberOfPersons = this.editMealForm?.controls['mealNumberOfPersons'].value;

    return meal;
  }

  private save(): Observable<Meal|undefined> {
    return this.currentAction$
    .pipe(
      exhaustMap(currentAction => {
        const meal: Meal = this.getMeal();

        if (currentAction === Action.update) {
          return this.mealService.update(meal);
        } else if (currentAction === Action.create) {
          return this.mealService.create(meal);
        }

        return of(undefined);
      })
    );
  }

  private handleError(error: any): void {
    this.isSaving = false;
    window.alert("Problème technique. Veuillez réessayer dans quelques minutes.");
  }

  public goToDisplayMeals(): Promise<boolean> {
    const date: Date = this.editMealForm?.controls['mealDate'].value;

    return this.router.navigate(
      [MealRoutes.displayMealsRoute],
      { queryParams: { defaultSelectedDate: moment(date).format("YYYY-MM-DD") } }
      );
  }

  public editMeal(): void {
    // Pour forcer l'apparition des erreurs.
    this.editMealForm?.markAllAsTouched();
    if (this.editMealForm?.valid) {
      this.isSaving = true;
      this.saveSubscription 
      = this.save()
      .subscribe({ 
        next: () => this.goToDisplayMeals(),
        error: (error) => this.handleError(error)
      });
    }
  }
}