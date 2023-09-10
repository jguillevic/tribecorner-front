import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, Auth, signInWithEmailAndPassword, UserCredential, signOut, onAuthStateChanged, browserLocalPersistence, setPersistence, User, Unsubscribe } from "firebase/auth";
import { environment } from 'src/environments/environment.development';
import { SignUpUser } from '../model/sign-up-user.model';
import { UserInfo } from '../model/user-info.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, defer, map, of, switchMap, tap } from 'rxjs';
import { SignInUser } from '../model/sign-in-user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoadUserDto } from '../dto/load-user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private apiPath = 'users';
  private firebaseAuth: Auth;
  private onAuthStateChangedUnsubscribe: Unsubscribe;

  public isSignedIn: boolean|undefined = undefined;
  public isSignedInDefinedEvent = new EventEmitter();

  constructor(private http: HttpClient) { 
    const app: FirebaseApp = initializeApp(environment.firebaseConfig);
    this.firebaseAuth = getAuth(app);

    this.onAuthStateChangedUnsubscribe = this.firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.isSignedIn = true;
      } else {
        this.isSignedIn = false;
      }
      this.notifyIsSignedInDefined();
    });
  }

  public ngOnDestroy(): void {
    this.onAuthStateChangedUnsubscribe();
  }

  private notifyIsSignedInDefined(): void {
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

  private firebaseCreateUserWithEmailAndPassword(signUpUser: SignUpUser) : Observable<UserCredential|undefined> {
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

  private createUser(userCredential: UserCredential, signUpUser: SignUpUser): Observable<UserInfo|undefined> {
    const headers: HttpHeaders = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('Accept', 'application/json');

    const createUserDto: CreateUserDto = UserService.fromSignUpUserToCreateUserDto(userCredential.user.uid, signUpUser);
    const body: string = JSON.stringify(createUserDto);

    return this.http.post<LoadUserDto>(
      `${environment.apiUrl}${this.apiPath}`,
      body,
      { 'headers': headers }
    )
      .pipe(
        switchMap((LoadUserDto) => { return of(UserService.fromLoadUserDtoToUserInfo(LoadUserDto)); }),
        catchError((error) => {
          console.log(error);
          return of(undefined);
        })
      );
  }

  public signUp(signUpUser: SignUpUser): Observable<UserInfo|undefined> {
    return this.firebaseSetPersistenceToLocal()
      .pipe(
        switchMap((result) => { 
          if (result) {
            return this.firebaseCreateUserWithEmailAndPassword(signUpUser)
            .pipe(
              switchMap((userCredential) => { 
                if (userCredential) {
                  // Enregistrement des informations spécifiques à l'application.
                  return this.createUser(userCredential, signUpUser)
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

  private firebaseSignInWithEmailAndPassword(signInUser: SignInUser) : Observable<UserCredential|undefined> {
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
  
  public signIn(signInUser: SignInUser): Observable<UserInfo|undefined> {
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

  private loadUserFromEmail(userCredential: UserCredential): Observable<UserInfo|undefined> {
    const headers: HttpHeaders = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('Accept', 'application/json');

    return this.http.get<LoadUserDto>(
      `${environment.apiUrl}${this.apiPath}?email=${userCredential.user.email}`,
      { 'headers': headers }
    )
      .pipe(
        switchMap((LoadUserDto) => { return of(UserService.fromLoadUserDtoToUserInfo(LoadUserDto)); }),
        catchError((error) => {
          console.log(error);
          return of(undefined);
        })
      );
  }

  public signOut() : Observable<void> {
    return defer(async () => {
      signOut(this.firebaseAuth);
    })
    .pipe(
      tap(() => this.isSignedIn = false),
      catchError((error) => { 
        console.log(error);
        return of();
      })
    )
  }

  private static fromSignUpUserToCreateUserDto(firebaseId: string, signUpUser: SignUpUser): CreateUserDto {
    const createUserDto = new CreateUserDto();

    createUserDto.firebaseId = firebaseId;
    createUserDto.email = signUpUser.email;
    createUserDto.username = signUpUser.username;

    return createUserDto;
  }

  private static fromLoadUserDtoToUserInfo(loadUserDto: LoadUserDto): UserInfo {
    const userInfo = new UserInfo();

    userInfo.id = loadUserDto.id;
    userInfo.firebaseId = loadUserDto.firebaseId;
    userInfo.email = loadUserDto.email;
    userInfo.username = loadUserDto.username;
    userInfo.familyId = loadUserDto.familyId;

    return userInfo;
  }
}