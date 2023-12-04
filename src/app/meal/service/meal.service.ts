import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Meal } from '../model/meal.model';
import { environment } from '../../../environments/environment';
import { MealConverter } from '../converter/meal.converter';
import { LoadMealDto } from '../dto/load-meal.dto';
import { ApiHttpClient } from '../../common/http/api-http-client';
import { DateHelper } from '../../common/date/helper/date.helper';
import { EditMealDto } from '../dto/edit-meal.dto';

@Injectable()
export class MealService {
  private static apiPath: string = "meals";

  public constructor(
    private apiHttp: ApiHttpClient
  ) { }

  public loadAllByDate(date: Date): Observable<Meal[]> {
    const dateStr: string = DateHelper.toISODate(date);

    return this.apiHttp.get<LoadMealDto[]>(
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
    return this.apiHttp.get<LoadMealDto>(
      `${environment.apiUrl}${MealService.apiPath}/${mealId}`
      )
      .pipe(
        map(mealDto => 
          MealConverter.fromDtoToModel(mealDto)
        )
      );
  }

  public create(meal: Meal): Observable<Meal> {
    const editMealDto: EditMealDto = MealConverter.fromModelToDto(meal);
    const body: string = JSON.stringify(editMealDto);

    return this.apiHttp.post<LoadMealDto>(
      `${environment.apiUrl}${MealService.apiPath}`,
      body
      )
      .pipe(
        map(loadMealDto => 
            MealConverter.fromDtoToModel(loadMealDto)
        )
      );
  }

  public update(meal: Meal): Observable<Meal> {
    const editMealDto: EditMealDto = MealConverter.fromModelToDto(meal);
    const body: string = JSON.stringify(editMealDto);

    return this.apiHttp.put<LoadMealDto>(
      `${environment.apiUrl}${MealService.apiPath}/${meal.id}`,
      body
      )
      .pipe(
        map(loadMealDto => 
            MealConverter.fromDtoToModel(loadMealDto)
        )
      );
  }

  public delete(mealId: number): Observable<void> {
    return this.apiHttp.delete<void>(
      `${environment.apiUrl}${MealService.apiPath}/${mealId}`
      );
  }
}
