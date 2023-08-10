import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ShoppingList } from './shopping-list';
import { Observable, catchError, of, tap } from 'rxjs';
import { GlobalConstants } from '../config/global-constants';

@Injectable()
export class ShoppingListService {

  constructor(private http: HttpClient) { }

  get(): Observable<ShoppingList> {
    return this.http.get<ShoppingList>(`${GlobalConstants.apiEndpoint}shopping-list/get`).pipe(
      tap((list) => console.table(list)),
      catchError((error) => { 
        console.log(error);
        return of(new ShoppingList);
      })
      );
  }

  save(shoppingList: ShoppingList): void { }
}
