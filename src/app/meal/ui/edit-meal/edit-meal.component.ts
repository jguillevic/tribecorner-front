import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal } from '../../model/meal.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Action } from 'src/app/common/action';
import { MealService } from '../../service/meal.service';
import { BehaviorSubject, Observable, Subscription, combineLatest, debounceTime, filter, map, mergeMap, of, shareReplay, skip, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MealRoutes } from '../../route/meal.routes';
import { MatSelectModule } from '@angular/material/select';
import { MealKindService } from '../../service/meal-kind.service';
import { MealKind } from '../../model/meal-kind.model';
import { EditTopBarComponent } from "../../../common/top-bar/edit/ui/edit-top-bar/edit-top-bar.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import * as moment from 'moment';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { GoBackTopBarComponent } from "../../../common/top-bar/go-back/ui/go-back-top-bar.component";

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
        EditTopBarComponent,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        SimpleLoadingComponent,
        MtxButtonModule,
        GoBackTopBarComponent
    ]
})
export class EditMealComponent implements OnInit, OnDestroy {
  private autoSaveSubscription: Subscription|undefined;
  private currentMealId: number|undefined;

  private readonly mealKinds$: Observable<MealKind[]> 
  = this.mealKindService
  .loadAll();

  private readonly isSavingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isSaving$: Observable<boolean> = this.isSavingSubject.asObservable();

  private readonly isClosingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isClosing$: Observable<boolean> = this.isClosingSubject.asObservable();

  public readonly numbersOfPersons: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  // Formulaire.
  public readonly mealNameMaxLength: number = 255; 

  private editMealForm: FormGroup 
  = new FormGroup(
    {
      mealKindId: new FormControl(0, [Validators.required]),
      mealName: new FormControl('', [Validators.required, Validators.maxLength(this.mealNameMaxLength)]),
      mealDate: new FormControl(new Date(), [Validators.required]),
      mealNumberOfPersons: new FormControl(0, [Validators.required])
    }
  );

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
    tap(meal => {
      this.editMealForm.controls['mealKindId'].setValue(meal.mealKindId ?? 1);
      this.editMealForm.controls['mealName'].setValue(meal.name);
      this.editMealForm.controls['mealDate'].setValue(meal.date);
      this.editMealForm.controls['mealNumberOfPersons'].setValue(meal.numberOfPersons ?? 3);
    }),
    map(() => this.editMealForm)
  );

  public readonly editMealFormData$ 
  = combineLatest({
    editMealForm: this.editMealForm$,
    mealKinds: this.mealKinds$
  });

  public constructor(
    private activatedRoute: ActivatedRoute,
    private mealKindService: MealKindService,
    private mealService: MealService
    ) {
  }

  public ngOnInit(): void {
    this.autoSaveSubscription 
    = this.editMealForm.valueChanges
    .pipe(
      debounceTime(500),
      filter(() => !this.editMealForm.pristine && this.editMealForm.valid),
      switchMap(() => this.save())
    )
    .subscribe();
  }
  
  public ngOnDestroy(): void {
    this.autoSaveSubscription?.unsubscribe();
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

  private save(): Observable<Meal> {
    const meal: Meal = this.getMeal();

    if (this.currentMealId !== undefined) {
      return this.mealService.update(meal);
    }

    return this.mealService.create(meal)
    .pipe(
      tap(meal => this.currentMealId = meal.id)
    );
  }
}