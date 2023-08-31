import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, Auth, signInWithEmailAndPassword, UserCredential, signOut, onAuthStateChanged, browserLocalPersistence, setPersistence, User, Unsubscribe } from "firebase/auth";
import { environment } from 'src/environments/environment.development';
import { SignUpUser } from '../model/sign-up-user';
import { UserInfo } from '../model/user-info';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, defer, of, switchMap, tap } from 'rxjs';
import { SignInUser } from '../model/sign-in-user';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private firebaseAuth: Auth;
  private unsubscribe: Unsubscribe;

  public isSignedIn: boolean | undefined = undefined;
  public isSignedInDefinedEvent = new EventEmitter();

  constructor(private http: HttpClient) { 
    const app: FirebaseApp = initializeApp(environment.firebaseConfig);
    this.firebaseAuth = getAuth(app);

    this.unsubscribe = this.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.isSignedIn = true;
      } else {
        this.isSignedIn = false;
      }
      this.notifyIsSignedInDefined();
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  private notifyIsSignedInDefined() {
    this.isSignedInDefinedEvent.emit();
  }

  private firebaseSetPersistenceToLocal(): Observable<boolean> {
    return defer(async () => {
      await setPersistence(this.firebaseAuth, browserLocalPersistence);
      return true;
    })
      .pipe(   
        catchError((error) => { 
          console.log(error);
          return of(false);
        })
      );
  }

  private firebaseCreateUserWithEmailAndPassword(signUpUser: SignUpUser) : Observable<UserCredential | undefined> {
    return defer(async () => {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.firebaseAuth, signUpUser.email, signUpUser.password);

      return userCredential;
    })
      .pipe(
        catchError((error) => { 
          console.log(error);
          return of(undefined);
        })
      );
  }

  private addUser(userCredential: UserCredential, signUpUser: SignUpUser) {
    const headers: HttpHeaders = new HttpHeaders()
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
  }

  public signUp(signUpUser: SignUpUser): Observable<UserInfo | undefined> {
    return this.firebaseSetPersistenceToLocal()
      .pipe(
        switchMap((result) => { 
          if (result) {
            return this.firebaseCreateUserWithEmailAndPassword(signUpUser)
            .pipe(
              switchMap((userCredential) => { 
                if (userCredential) {
                  // Enregistrement des informations spécifiques à l'application.
                  return this.addUser(userCredential, signUpUser)
                  .pipe(
                    tap((userInfo) => { this.isSignedIn = true; })
                  );  
                }
                return of(undefined);
              })
            );
          }

          return of(undefined);
          })
        );
  }

  private firebaseSignInWithEmailAndPassword(signInUser: SignInUser) : Observable<UserCredential | undefined> {
    return defer(async () => {
      const userCredential: UserCredential = await signInWithEmailAndPassword(this.firebaseAuth, signInUser.email, signInUser.password);

      return userCredential;
    })
    .pipe(
      catchError((error) => { 
        console.log(error);
        return of(undefined);
      })
    );
  }
  
  public signIn(signInUser: SignInUser): Observable<UserInfo | undefined> {
    return this.firebaseSetPersistenceToLocal()
    .pipe(
      switchMap((result) => { 
        if (result) {
          return this.firebaseSignInWithEmailAndPassword(signInUser)
          .pipe(
            switchMap((userCredential) => {
              if (userCredential) {
                return this.loadUserFromEmail(userCredential)
                .pipe(
                  tap((userInfo) => { this.isSignedIn = true; })
                ); 
              }
              return of(undefined);
            })
          );
        }
        return of(undefined);
      })
    );
  }

  private loadUserFromEmail(userCredential: UserCredential) {
    const headers: HttpHeaders = new HttpHeaders()
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
  }

  public signOut() : Observable<boolean> {
    return defer(async () => {
      signOut(this.firebaseAuth);
      return true;
    })
    .pipe(
      catchError((error) => { 
        console.log(error);
        return of(false);
      })
    )
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