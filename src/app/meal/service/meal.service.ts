import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Meal } from '../model/meal.model';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MealConverter } from '../converter/meal.converter';
import { MealDto } from '../dto/meal.dto';
import * as moment from 'moment';

@Injectable()
export class MealService {
  private static apiPath: string = "meals";

  private mealConverter: MealConverter;

  public constructor(
    private http: HttpClient
    ) { 
      this.mealConverter = new MealConverter();
    }

  public loadAllByDate(date: Date, familyId: number): Observable<Meal[]> {
    const headers: HttpHeaders= new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    return this.http.get<MealDto[]>(
      `${environment.apiUrl}${MealService.apiPath}?family=${familyId}&date=${moment(date).format("YYYY-MM-DD")}`,
      { 'headers': headers }
      )
      .pipe(
        switchMap((mealDtos) => {
          const meals: Meal[] = [];
          mealDtos.forEach(mealDto => {
            const meal: Meal = this.mealConverter.fromDtoToModel(mealDto);
            meals.push(meal);
          });
          return of(meals);
        })
      );
  }

  public loadOneById(mealId: number): Observable<Meal>
  {
    const headers: HttpHeaders= new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    return this.http.get<MealDto>(
      `${environment.apiUrl}${MealService.apiPath}/${mealId}`,
      { 'headers': headers }
      )
      .pipe(
        switchMap((mealDto) => {
          const meal: Meal = this.mealConverter.fromDtoToModel(mealDto);
          return of(meal);
        })
      );
  }

  public create(meal: Meal): Observable<Meal> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    const mealDto = this.mealConverter.fromModelToDto(meal);
    const body: string = JSON.stringify(mealDto);

    return this.http.post<MealDto>(
      `${environment.apiUrl}${MealService.apiPath}`,
      body,
      { 'headers': headers }
      )
      .pipe(
        switchMap((mealDto) => {
            return of(this.mealConverter.fromDtoToModel(mealDto));
        })
      );
  }

  public update(meal: Meal): Observable<Meal> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    const mealDto = this.mealConverter.fromModelToDto(meal);
    const body: string = JSON.stringify(mealDto);

    return this.http.put<MealDto>(
      `${environment.apiUrl}${MealService.apiPath}/${meal.id}`,
      body,
      { 'headers': headers }
      )
      .pipe(
        switchMap((mealDto) => {
            return of(this.mealConverter.fromDtoToModel(mealDto));
        })
      );
  }

  public delete(mealId: number): Observable<void> {
    const headers: HttpHeaders= new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    return this.http.delete<void>(
      `${environment.apiUrl}${MealService.apiPath}/${mealId}`,
      { 'headers': headers }
      );
  }
}
