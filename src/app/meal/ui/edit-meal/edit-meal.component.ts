import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal } from '../../model/meal.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MealService } from '../../service/meal.service';
import { Observable, Subject, combineLatest, debounceTime, filter, map, mergeMap, of, switchMap, takeUntil, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MealKindService } from '../../service/meal-kind.service';
import { MealKind } from '../../model/meal-kind.model';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { GoBackTopBarComponent } from "../../../common/top-bar/go-back/ui/go-back-top-bar.component";
import { MealCurrentDateService } from '../../service/meal-current-date.service';
import { DateHelper } from '../../../common/date/helper/date.helper';

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
        ReactiveFormsModule,
        SimpleLoadingComponent,
        MtxButtonModule,
        GoBackTopBarComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditMealComponent implements OnInit, OnDestroy {
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
      mealKindId: new FormControl(0, [Validators.required]),
      name: new FormControl('', [Validators.required, Validators.maxLength(this.mealNameMaxLength)]),
      date: new FormControl(
        DateHelper.getCurrentDate(),
        [Validators.required]
      ),
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
      takeUntil(this.destroy$),
      debounceTime(500),
      filter(() => !this.editMealForm.pristine && this.editMealForm.valid),
      switchMap(() => this.save())
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
          currentDate: this.mealCurrentDateService.currentDate$
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
            3,
            1
          );
          return of(meal);
          }),
          tap(meal => {
            this.editMealForm.controls['mealKindId'].setValue(meal.mealKindId);
            this.editMealForm.controls['name'].setValue(meal.name);
            this.editMealForm.controls['date'].setValue(meal.date);
            this.editMealForm.controls['numberOfPersons'].setValue(meal.numberOfPersons);
        }),
        map(() => this.editMealForm)
    );
}

  private getMeal(): Meal {
    const meal: Meal = this.editMealForm.value as Meal;
    meal.id = this.currentMealId;
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