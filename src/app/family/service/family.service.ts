import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Family } from '../model/family.model';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class FamilyService {

  constructor(private http: HttpClient) { }

  public readFromUserId(): Observable<Family|undefined> {
    return of (undefined);
  }

  public create(familyName: string): Observable<Family|undefined> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    const family: Family = new Family();
    family.name = familyName;
    const body: string = JSON.stringify(family);

    return this.http.put<Family>(
      `${environment.apiUrl}shopping_lists`,
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

  public createMember(familyId: number, userId: number): Observable<User|undefined> {
    return of(undefined);
  } 
}
