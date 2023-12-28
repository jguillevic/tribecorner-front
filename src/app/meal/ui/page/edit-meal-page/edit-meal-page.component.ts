import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal } from '../../../model/meal.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MealService } from '../../../service/meal.service';
import { Observable, Subject, combineLatest, debounceTime, exhaustMap, filter, map, mergeMap, of, takeUntil, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MealKindService } from '../../../service/meal-kind.service';
import { MealKind } from '../../../model/meal-kind.model';
import { SimpleLoadingComponent } from "../../../../common/loading/ui/simple-loading/simple-loading.component";
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { GoBackTopBarComponent } from "../../../../common/top-bar/go-back/ui/go-back-top-bar.component";
import { MealCurrentDateService } from '../../../service/meal-current-date.service';
import { DateHelper } from '../../../../common/date/helper/date.helper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-edit-meal-page',
    standalone: true,
    templateUrl: './edit-meal-page.component.html',
    styles: [],
    imports: [
        CommonModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        MatSelectModule,
        ReactiveFormsModule,
        SimpleLoadingComponent,
        MtxButtonModule,
        GoBackTopBarComponent,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditMealPageComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  private currentMealId: number = 0;

  private readonly mealKinds$: Observable<MealKind[]> 
  = this.mealKindService
  .loadAll();

  public readonly numbersOfPersons: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  // Formulaire.
  public readonly mealNameMaxLength: number = 255;

  private editMealForm: FormGroup 
  = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.maxLength(this.mealNameMaxLength)]),
      date: new FormControl(
        DateHelper.getCurrentDate(),
        [Validators.required]
      ),
      mealKindId: new FormControl(0, [Validators.required]),
      numberOfPersons: new FormControl(0, [Validators.required])
    }
  );

  private readonly editMealForm$: Observable<FormGroup> = this.getEditMealForm$();

  public readonly editMealFormData$ 
  = combineLatest({
    editMealForm: this.editMealForm$,
    mealKinds: this.mealKinds$
  });

  public constructor(
    private activatedRoute: ActivatedRoute,
    private mealKindService: MealKindService,
    private mealService: MealService,
    private mealCurrentDateService: MealCurrentDateService
  ) { }

  public ngOnInit(): void {
    this.editMealForm.valueChanges
    .pipe(
      debounceTime(500),
      filter(() => 
        !this.editMealForm.pristine &&
        this.editMealForm.valid
      ), 
      exhaustMap(() => this.save()),
      takeUntil(this.destroy$)
    )
    .subscribe();
  }
  
  public ngOnDestroy(): void {
    this.destroy$.complete();
  }

  private getEditMealForm$(): Observable<FormGroup> {
    return combineLatest(
      {
          params: this.activatedRoute.queryParams,
          currentDate: this.mealCurrentDateService.currentDate$,
          defaultNumberOfPersons: this.mealService.defaultNumberOfPersons$
      }
    )
    .pipe(
        mergeMap(result => {    
          this.currentMealId = result.params['id']
          if (this.currentMealId) {
              return this.mealService.loadOneById(this.currentMealId);
          }
          const defaultDate = result.currentDate;
          const meal: Meal = new Meal(
            0,
            '',
            defaultDate,
            result.defaultNumberOfPersons,
            1
          );
          return of(meal);
        }),
        map((meal: Meal) => this.updateEditMealForm(meal))
    );
}

  private getMeal(): Meal {
    const meal: Meal = this.editMealForm.value as Meal;
    meal.id = this.currentMealId;
    return meal;
  }

  public getNameControl(): AbstractControl<any, any> {
    return this.editMealForm.controls['name'];
  }

  public getDateControl(): AbstractControl<any, any> {
    return this.editMealForm.controls['date'];
  }

  public getMealKindIdControl(): AbstractControl<any, any> {
    return this.editMealForm.controls['mealKindId'];
  }

  public getNumberOfPersonsControl(): AbstractControl<any, any> {
    return this.editMealForm.controls['numberOfPersons'];
  }

  public updateNameControl(name: string): void {
    this.getNameControl().setValue(name);
  }

  public updateDateControl(date: Date|undefined): void {
    this.getDateControl().setValue(date);
  }

  public updateMealKindIdControl(mealKindId: number|undefined): void {
    this.getMealKindIdControl().setValue(mealKindId);
  }

  public updateNumberOfPersonsControl(numberOfPersons: number|undefined): void {
    this.getNumberOfPersonsControl().setValue(numberOfPersons);
  }

  public updateEditMealForm(meal: Meal): FormGroup {
    this.updateNameControl(meal.name);
    this.updateDateControl(meal.date);
    this.updateMealKindIdControl(meal.mealKindId);
    this.updateNumberOfPersonsControl(meal.numberOfPersons);

    return this.editMealForm;
  }

  public getNameErrorMessage(): Observable<string|undefined> {
    return of(undefined);
  }

  public getDateErrorMessage(): Observable<string|undefined> {
    return of(undefined);
  }

  public getMealKindIdErrorMessage(): Observable<string|undefined> {
    return of(undefined);
  }

  public getNumberofPersonsErrorMessage(): Observable<string|undefined> {
    return of(undefined);
  }

  private save(): Observable<Meal> {
    const meal: Meal = this.getMeal();

    if (this.currentMealId) {
      return this.mealService.update(meal);
    }

    return this.mealService.create(meal)
    .pipe(
      tap(meal => this.currentMealId = meal.id)
    );
  }
}