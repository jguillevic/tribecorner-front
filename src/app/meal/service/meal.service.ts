import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, combineLatest, map, mergeMap, of, tap} from 'rxjs';
import {Meal} from '../model/meal.model';
import {environment} from '../../../environments/environment';
import {MealConverter} from '../converter/meal.converter';
import {MealDto} from '../dto/meal.dto';
import {ApiHttpClient} from '../../common/http/api-http-client';
import {DateHelper} from '../../common/date/helper/date.helper';
import {FamilyApiService} from '../../family/service/family-api.service';
import {Family} from '../../family/model/family.model';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private static apiPath: string = "meals";

  public readonly defaultNumberOfPersons$: Observable<number> 
  = this.familyApiService.family$
  .pipe(
    map((family: Family|undefined) => 
      { 
        return (family ? family.members.length : 2); 
      }
    )
  );

  private lastDate: Date|undefined;
  private readonly loadedMealsByDateSubject: BehaviorSubject<Meal[]> = new BehaviorSubject<Meal[]>([]);
  private readonly loadedMealsByDate$: Observable<Meal[]> = this.loadedMealsByDateSubject.asObservable();
  private readonly addedMealsSubject: BehaviorSubject<Meal[]> = new BehaviorSubject<Meal[]>([]);
  private readonly addedMeals$: Observable<Meal[]> = this.addedMealsSubject.asObservable();
  private readonly updatedMealsSubject: BehaviorSubject<Meal[]> = new BehaviorSubject<Meal[]>([]);
  private readonly updatedMeals$: Observable<Meal[]> = this.updatedMealsSubject.asObservable();
  private readonly deletedMealIdsSubject: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  private readonly deletedMealIds$: Observable<number[]> = this.deletedMealIdsSubject.asObservable();

  public constructor(
    private readonly apiHttp: ApiHttpClient,
    private readonly familyApiService: FamilyApiService
  ) { }

  private resetCache(meals: Meal[] = []): void {
    this.loadedMealsByDateSubject.next(meals);
    this.addedMealsSubject.next([]);
    this.updatedMealsSubject.next([]);
    this.deletedMealIdsSubject.next([]);
  }

  private initializeLoadedMealsByDate(date: Date): Observable<Meal[]> {
    return this.loadAllByDate(date)
    .pipe(
      tap(meals => {
          this.resetCache();
          this.lastDate = date;
          this.loadedMealsByDateSubject.next(meals);
        }
      ),
      mergeMap(() => this.loadedMealsByDate$)
    );
  }

  private getLoadedMealsByDate(date: Date): Observable<Meal[]> {
    if (!this.lastDate || !DateHelper.areDatesEqual(this.lastDate as Date, date)) {
      return this.initializeLoadedMealsByDate(date);
    }
    return this.loadedMealsByDate$;
  }

  public getMealsByDate(date: Date): Observable<Meal[]> {
    return combineLatest({
      loadedMealsByDate: this.getLoadedMealsByDate(date),
      addedMeals: this.addedMeals$,
      updatedMeals: this.updatedMeals$,
      deletedMeals: this.deletedMealIds$
    })
    .pipe(
      map(result => 
        [
          ...result.loadedMealsByDate.filter(meal => !result.updatedMeals.map(updatedMeal => updatedMeal.id).includes(meal.id)),
          ...this.addedMealsSubject.value.filter(meal => !result.updatedMeals.map(updatedMeal => updatedMeal.id).includes(meal.id)),
          ...this.updatedMealsSubject.value
        ]
        .filter(meal => 
          !this.deletedMealIdsSubject.value.includes(meal.id)
        )
      )
    );
  }

  private loadAllByDate(date: Date): Observable<Meal[]> {
    const dateStr: string = DateHelper.toISODate(date);

    return this.apiHttp.get<MealDto[]>(
      `${environment.apiUrl}${MealService.apiPath}?date=${dateStr}`
      )
      .pipe(
        map(mealDtos =>
          mealDtos.map(mealDto => 
            MealConverter.fromDtoToModel(mealDto)
          )
        )
      );
  }

  public loadOneById(mealId: number): Observable<Meal>
  {
    return this.apiHttp.get<MealDto>(
      `${environment.apiUrl}${MealService.apiPath}/${mealId}`
      )
      .pipe(
        map(mealDto => 
          MealConverter.fromDtoToModel(mealDto)
        )
      );
  }

  public create(meal: Meal): Observable<Meal> {
    const editMealDto: MealDto = MealConverter.fromModelToDto(meal);
    const body: string = JSON.stringify(editMealDto);

    return this.apiHttp.post<MealDto>(
      `${environment.apiUrl}${MealService.apiPath}`,
      body
      )
      .pipe(
        map((mealDto: MealDto) => 
          MealConverter.fromDtoToModel(mealDto)
        ),
        tap((meal: Meal) => 
          this.addedMealsSubject.next([...this.addedMealsSubject.value, meal])
        )
      );
  }

  public update(meal: Meal): Observable<Meal> {
    const mealDto: MealDto = MealConverter.fromModelToDto(meal);
    const body: string = JSON.stringify(mealDto);

    return this.apiHttp.put<MealDto>(
      `${environment.apiUrl}${MealService.apiPath}/${meal.id}`,
      body
      )
      .pipe(
        map((mealDto: MealDto) => 
            MealConverter.fromDtoToModel(mealDto)
        ),
        tap((meal: Meal) =>
          this.updatedMealsSubject.next([...this.updatedMealsSubject.value.filter(m => m.id !== meal.id), meal])
        )
      );
  }

  public delete(mealId: number): Observable<void> {
    this.deletedMealIdsSubject.next([...this.deletedMealIdsSubject.value, mealId]);
    return this.apiHttp.delete<void>(
      `${environment.apiUrl}${MealService.apiPath}/${mealId}`
    );
  }
}
