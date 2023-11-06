import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, exhaustMap } from "rxjs";
import { UserService } from "src/app/user/service/user.service";

@Injectable({
    providedIn: 'root'
  })
export class ApiHttpClient {
    public constructor(
        private http: HttpClient,
        private userService: UserService
    ) { }

    public get<T>(url: string): Observable<T> {
        return this.userService.getFirebaseJWT()
        .pipe(
          exhaustMap(token => {
            const headers: HttpHeaders= new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);
    
            return this.http.get<T>(
              url,
              { 'headers': headers }
              );
          })
        );
    }

    public post<T>(url: string, body: any | null): Observable<T> {
        return this.userService.getFirebaseJWT()
        .pipe(
          exhaustMap(token => {
            const headers: HttpHeaders= new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);
    
            return this.http.post<T>(
              url,
              body,
              { 'headers': headers }
              );
          })
        );
    }

    public put<T>(url: string, body: any | null): Observable<T> {
        return this.userService.getFirebaseJWT()
        .pipe(
          exhaustMap(token => {
            const headers: HttpHeaders= new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);
    
            return this.http.put<T>(
              url,
              body,
              { 'headers': headers }
              );
          })
        );
    }

    public patch<T>(url: string, body: any | null): Observable<T> {
      return this.userService.getFirebaseJWT()
      .pipe(
        exhaustMap(token => {
          const headers: HttpHeaders= new HttpHeaders()
          .set('Content-type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`);
  
          return this.http.patch<T>(
            url,
            body,
            { 'headers': headers }
            );
        })
      );
  }

    public delete<T>(url: string): Observable<T> {
        return this.userService.getFirebaseJWT()
        .pipe(
          exhaustMap(token => {
            const headers: HttpHeaders= new HttpHeaders()
            .set('Content-type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);
    
            return this.http.delete<T>(
              url,
              { 'headers': headers }
              );
          })
        );
    }
}