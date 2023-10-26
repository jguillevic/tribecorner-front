import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Meal } from '../model/meal.model';
import { environment } from 'src/environments/environment';
import { MealConverter } from '../converter/meal.converter';
import { MealDto } from '../dto/meal.dto';
import * as moment from 'moment';
import { ApiHttpClient } from 'src/app/common/http/api-http-client';

@Injectable()
export class MealService {
  private static apiPath: string = "meals";

  private mealConverter: MealConverter;

  public constructor(
    private apiHttp: ApiHttpClient
    ) { 
      this.mealConverter = new MealConverter();
    }

  public loadAllByDate(date: Date, familyId: number): Observable<Meal[]> {
    return this.apiHttp.get<MealDto[]>(
      `${environment.apiUrl}${MealService.apiPath}?family=${familyId}&date=${moment(date).format("YYYY-MM-DD")}`
      )
      .pipe(
        map(mealDtos => 
          mealDtos.map(mealDto => 
            this.mealConverter.fromDtoToModel(mealDto)
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
          this.mealConverter.fromDtoToModel(mealDto)
        )
      );
  }

  public create(meal: Meal): Observable<Meal> {
    const mealDto = this.mealConverter.fromModelToDto(meal);
    const body: string = JSON.stringify(mealDto);

    return this.apiHttp.post<MealDto>(
      `${environment.apiUrl}${MealService.apiPath}`,
      body
      )
      .pipe(
        map(mealDto => 
            this.mealConverter.fromDtoToModel(mealDto)
        )
      );
  }

  public update(meal: Meal): Observable<Meal> {
    const mealDto = this.mealConverter.fromModelToDto(meal);
    const body: string = JSON.stringify(mealDto);

    return this.apiHttp.put<MealDto>(
      `${environment.apiUrl}${MealService.apiPath}/${meal.id}`,
      body
      )
      .pipe(
        map(mealDto => 
            this.mealConverter.fromDtoToModel(mealDto)
        )
      );
  }

  public delete(mealId: number): Observable<void> {
    return this.apiHttp.delete<void>(
      `${environment.apiUrl}${MealService.apiPath}/${mealId}`
      );
  }
}
