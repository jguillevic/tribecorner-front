import {Injectable} from '@angular/core';
import {Observable, filter, first, map, shareReplay} from 'rxjs';
import {MealKind} from '../model/meal-kind.model';
import {environment} from '../../../environments/environment';
import {MealKindDto} from '../dto/meal-kind.dto';
import {ApiHttpClient} from '../../common/http/api-http-client';
import {MealKindConverter} from '../converter/meal-kind.converter';

@Injectable({
  providedIn: 'root',
})
export class MealKindService {
  private static apiPath: string = "meal_kinds";

  public constructor(
    private readonly apiHttp: ApiHttpClient
  ) { }

  public readonly mealKinds$: Observable<MealKind[]> 
  = this.loadAll()
  .pipe(
    shareReplay(1)
  );

  public readonly defaultMealKind$: Observable<MealKind|undefined>
  = this.mealKinds$
  .pipe(
    map(meals => meals.find(meal => meal.name === 'Déjeuner'))
  );

  public readonly defaultMealKindId$: Observable<number>
  = this.defaultMealKind$
  .pipe(
    map((defaultMealKind: MealKind|undefined) => defaultMealKind?.id ?? 1)
  )

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
          .sort((a, b) => a.position - b.position)
        )
      );
  }
}
