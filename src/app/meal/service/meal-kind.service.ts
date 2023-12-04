import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { MealKind } from '../model/meal-kind.model';
import { environment } from '../../../environments/environment';
import { LoadMealKindDto } from '../dto/load-meal-kind.dto';
import { ApiHttpClient } from '../../common/http/api-http-client';
import { MealKindConverter } from '../converter/meal-kind.converter';

@Injectable()
export class MealKindService {
  private static apiPath: string = "meal_kinds";

  public constructor(
    private apiHttp: ApiHttpClient
  ) { }

  public loadAll(): Observable<MealKind[]> {
    return this.apiHttp.get<LoadMealKindDto[]>(
      `${environment.apiUrl}${MealKindService.apiPath}`
      ).pipe(
        map(
          mealKindDtos => 
          mealKindDtos
          .map(mealKindDto => 
            MealKindConverter.fromDtoToModel(mealKindDto)
          )
        ),
        shareReplay(1)
      );
  }
}
