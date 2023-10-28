import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { MealKind } from '../model/meal-kind.model';
import { environment } from 'src/environments/environment';
import { MealKindDto } from '../dto/meal-kind.dto';
import { MealKindConverter } from '../converter/meal-kind.converter';
import { ApiHttpClient } from 'src/app/common/http/api-http-client';

@Injectable()
export class MealKindService {
  private static apiPath: string = "meal_kinds";

  private mealKindConverter: MealKindConverter;

  public constructor(
    private apiHttp: ApiHttpClient
    ) { 
      this.mealKindConverter = new MealKindConverter();
    }

  public loadAll(): Observable<MealKind[]> {
    return this.apiHttp.get<MealKindDto[]>(
      `${environment.apiUrl}${MealKindService.apiPath}`
      ).pipe(
        map(
          mealKindDtos => 
          mealKindDtos
          .map(mealKindDto => 
            this.mealKindConverter.fromDtoToModel(mealKindDto)
          )
        ),
        shareReplay(1)
      );
  }
}
