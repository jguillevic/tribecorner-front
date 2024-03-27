import {Injectable} from '@angular/core';
import {Observable, map} from 'rxjs';
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

  public defaultNumberOfPersons$: Observable<number> 
  = this.familyApiService.family$
  .pipe(
    map((family: Family|undefined) => 
      { 
        return (family ? family.members.length : 2); 
      }
    )
  );

  public constructor(
    private apiHttp: ApiHttpClient,
    private familyApiService: FamilyApiService
  ) { }

  public loadAllByDate(date: Date): Observable<Meal[]> {
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
        map(mealDto => 
            MealConverter.fromDtoToModel(mealDto)
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
        map(mealDto => 
            MealConverter.fromDtoToModel(mealDto)
        )
      );
  }

  public delete(mealId: number): Observable<void> {
    return this.apiHttp.delete<void>(
      `${environment.apiUrl}${MealService.apiPath}/${mealId}`
      );
  }
}
