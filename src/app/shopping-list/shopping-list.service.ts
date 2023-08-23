import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ShoppingList } from './shopping-list';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class ShoppingListService {

  constructor(private http: HttpClient) { }

  get(): Observable<ShoppingList[]> {
    const headers: HttpHeaders= new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    return this.http.get<ShoppingList[]>(
      `${environment.apiUrl}shopping_lists`
      , { 'headers': headers }
      )
      .pipe(
        catchError((error) => { 
          console.log(error);
          return of([]);
        })
      );
  }

  edit(shoppingList: ShoppingList): Observable<ShoppingList|undefined> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    const body: string = JSON.stringify(shoppingList);

    return this.http.put<ShoppingList>(
      `${environment.apiUrl}shopping_lists/${shoppingList.id}`,
       body, 
       { 'headers': headers }
      )
      .pipe(
        catchError((error) => { 
          console.log(error);
          return of(undefined);
        })
      );
  }
}
