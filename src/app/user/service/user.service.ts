import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, Auth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { environment } from 'src/environments/environment.development';
import { SignUpUser } from '../model/sign-up-user';
import { UserInfo } from '../model/user-info';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, defer, of, switchMap } from 'rxjs';
import { SignInUser } from '../model/sign-in-user';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  public signUp(signUpUser: SignUpUser): Observable<UserInfo | undefined> {
    return defer(async () => {
        const app: FirebaseApp = initializeApp(environment.firebaseConfig);
        const auth: Auth = getAuth(app);
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, signUpUser.email, signUpUser.password);

        return userCredential;
      })
      .pipe(
        switchMap((userCredential) => { 
          // Enregistrement des informations spécifiques à l'application.
          const headers: HttpHeaders= new HttpHeaders()
          .set('Content-type', 'application/json')
          .set('Accept', 'application/json');

          const userInfo: UserInfo = UserService.getUserInfo(userCredential.user.uid, signUpUser);
          const body: string = JSON.stringify(userInfo);

          return this.http.post<UserInfo>(
            `${environment.apiUrl}users`,
            body,
            { 'headers': headers }
            )
            .pipe(
              catchError((error) => { 
                console.log(error);
                return of(undefined);
              })
            ); 
        }),
        catchError((error) => { 
          console.log(error);
          return of(undefined);
        })
      );
  }

  public signIn(signInUser: SignInUser): Observable<UserInfo | undefined> {
    return defer(async () => {
      const app: FirebaseApp = initializeApp(environment.firebaseConfig);
      const auth: Auth = getAuth(app);
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, signInUser.email, signInUser.password);

      return userCredential;
    })
    .pipe(
      switchMap((userCredential) => { 
        // Récupération des informations spécifiques à l'application.
        const headers: HttpHeaders= new HttpHeaders()
        .set('Content-type', 'application/json')
        .set('Accept', 'application/json');

        return this.http.get<UserInfo>(
          `${environment.apiUrl}users?email=${userCredential.user.email}`,
          { 'headers': headers }
          )
          .pipe(
            catchError((error) => { 
              console.log(error);
              return of(undefined);
            })
          ); 
      }),
      catchError((error) => { 
        console.log(error);
        return of(undefined);
      })
    );
  }

  private static getUserInfo(firebaseId: string, signUpUser: SignUpUser): UserInfo {
    const userInfo: UserInfo = new UserInfo();

    userInfo.firebaseId = firebaseId;
    userInfo.lastName = signUpUser.lastName;
    userInfo.firstName = signUpUser.firstName;
    userInfo.email = signUpUser.email;

    return userInfo;
  }
}