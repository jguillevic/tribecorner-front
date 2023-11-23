import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { MealKind } from '../model/meal-kind.model';
import { environment } from 'src/environments/environment';
import { MealKindDto } from '../dto/meal-kind.dto';
import { ApiHttpClient } from 'src/app/common/http/api-http-client';
import { MealKindConverter } from '../converter/meal-kind.converter';

@Injectable()
export class MealKindService {
  private static apiPath: string = "meal_kinds";

  public constructor(
    private apiHttp: ApiHttpClient
  ) { }

  public loadAll(): Observable<MealKind[]> {
    return this.apiHttp.get<MealKindDto[]>(
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
