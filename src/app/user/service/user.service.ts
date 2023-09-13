import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, Auth, signInWithEmailAndPassword, UserCredential, signOut, onAuthStateChanged, browserLocalPersistence, setPersistence, User, Unsubscribe } from "firebase/auth";
import { environment } from 'src/environments/environment.development';
import { SignUpUser } from '../model/sign-up-user.model';
import { UserInfo } from '../model/user-info.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription, catchError, defer, map, of, switchMap, tap } from 'rxjs';
import { SignInUser } from '../model/sign-in-user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoadUserDto } from '../dto/load-user.dto';
import { SessionStorageService } from 'src/app/common/storage/service/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private static apiPath: string = 'users';
  private static userInfoSessionStorageKey: string = 'userInfo';
  private firebaseAuth: Auth;
  private onAuthStateChangedUnsubscribe: Unsubscribe;
  private signInLocallySubscription: Subscription|undefined;

  private isSignedIn: boolean|undefined = undefined;
  public isSignedInDefinedEvent = new EventEmitter();

  public constructor(
    private http: HttpClient,
    private sessionStorageService: SessionStorageService
    ) { 
    const app: FirebaseApp = initializeApp(environment.firebaseConfig);
    this.firebaseAuth = getAuth(app);

    this.onAuthStateChangedUnsubscribe = this.firebaseAuth.onAuthStateChanged(
      (user) => this.onFirebaseAuthStateChange(user)
      );
  }

  public ngOnDestroy(): void {
    this.signInLocallySubscription?.unsubscribe();
    this.onAuthStateChangedUnsubscribe();
  }

  private notifyIsSignedInDefined(): void {
    this.isSignedInDefinedEvent.emit();
  }

  public getIsSignedIn(): boolean|undefined {
    return this.isSignedIn;
  }

  public setIsSignedIn(isSignedIn: boolean|undefined): void {
    if (this.isSignedIn != isSignedIn) {
      this.isSignedIn = isSignedIn;
      this.notifyIsSignedInDefined();
    }
  }

  public getCurrentUserInfo(): UserInfo|undefined {
    if (this.isSignedIn) {
      return JSON.parse(this.sessionStorageService.getData(UserService.userInfoSessionStorageKey));
    }
    return undefined;
  }

  private onFirebaseAuthStateChange(user: User|null): void {
    if (user) {
      this.signInLocallySubscription = this.signInLocally(user.uid).subscribe();
    } else {
      this.setIsSignedIn(false);
    }
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
      `${environment.apiUrl}${UserService.apiPath}`,
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

  private loadUserFromFirebaseId(firebaseId: string): Observable<UserInfo|undefined> {
    const headers: HttpHeaders = new HttpHeaders()
      .set('Content-type', 'application/json')
      .set('Accept', 'application/json');

    return this.http.get<LoadUserDto[]>(
      `${environment.apiUrl}${UserService.apiPath}?firebaseId=${firebaseId}`,
      { 'headers': headers }
    )
      .pipe(
        switchMap((loadUserDtos) => { 
          const loadUserDto: LoadUserDto|undefined = loadUserDtos.at(0);
          if (loadUserDto) {
            return of(UserService.fromLoadUserDtoToUserInfo(loadUserDto));
          }
          return of (undefined);
        }),
        catchError((error) => {
          console.log(error);
          return of(undefined);
        })
      );
  }

  private signInLocally(firebaseId: string): Observable<UserInfo|undefined> {
    return this.loadUserFromFirebaseId(firebaseId)
      .pipe(
        tap((userInfo) => { 
          if (userInfo) {
            this.sessionStorageService.saveData(UserService.userInfoSessionStorageKey, JSON.stringify(userInfo));
            this.setIsSignedIn(true);
          }
         })
      );
  }

  public refreshCurrentUser(): Observable<UserInfo|undefined> {
    const currentUserInfo: UserInfo|undefined = this.getCurrentUserInfo();
    if (currentUserInfo) {
      return this.loadUserFromFirebaseId(currentUserInfo.firebaseId)
        .pipe(
          tap((userInfo) => {
            if (userInfo) {
              this.sessionStorageService.saveData(UserService.userInfoSessionStorageKey, JSON.stringify(userInfo));
            }
          })
        );
    }

    return of(undefined);
  }

  private signOutLocally(): void {
    this.sessionStorageService.removeData(UserService.userInfoSessionStorageKey);
    this.setIsSignedIn(false);
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
                    switchMap((userInfo) => { 
                      if (userInfo) {
                        return this.signInLocally(userInfo?.firebaseId);
                      }
                      return of(undefined);
                    })
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
                return this.signInLocally(userCredential.user.uid);
              }
              return of(undefined);
            })
          );
        }
        return of(undefined);
      })
    );
  }

  public signOut() : Observable<void> {
    return defer(async () => {
      signOut(this.firebaseAuth);
    })
    .pipe(
      tap(() => this.signOutLocally()),
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