import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { MealKind } from '../model/meal-kind.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MealKindDto } from '../dto/meal-kind.dto';
import { MealKindConverter } from '../converter/meal-kind.converter';

@Injectable()
export class MealKindService {
  private static apiPath: string = "meal_kinds";

  private mealKindConverter: MealKindConverter;

  public constructor(
    private http: HttpClient
    ) { 
      this.mealKindConverter = new MealKindConverter();
    }

  public loadAll(): Observable<MealKind[]> {
    const headers: HttpHeaders= new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    return this.http.get<MealKindDto[]>(
      `${environment.apiUrl}${MealKindService.apiPath}`,
      { 'headers': headers }
      )
      .pipe(
        switchMap((mealKindDtos) => {
          const mealKinds: MealKind[] = [];
          mealKindDtos.forEach(mealKindDto => {
            const mealKind: MealKind = this.mealKindConverter.fromDtoToModel(mealKindDto);
            mealKinds.push(mealKind);
          });
          return of(mealKinds);
        })
      );
  }
}
