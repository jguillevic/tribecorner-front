import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Auth, Unsubscribe, User, UserCredential, browserLocalPersistence, createUserWithEmailAndPassword, getAuth, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { SignUpUser } from '../model/sign-up-user.model';
import { UserInfo } from '../model/user-info.model';
import { Observable, Subscription, exhaustMap, from, map, of, tap } from 'rxjs';
import { SignInUser } from '../model/sign-in-user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoadUserDto } from '../dto/load-user.dto';
import { SessionStorageService } from 'src/app/common/storage/service/session-storage.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FirebaseApp, initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private static apiPath: string = 'users';
  private static userInfoSessionStorageKey: string = 'userInfo';
  private firebaseAuth: Auth;
  private onAuthStateChangedUnsubscribe: Unsubscribe;
  private signInLocallySubscription: Subscription|undefined;

  private _isSignedIn: boolean | undefined = undefined;
  public get isSignedIn(): boolean|undefined {
    return this._isSignedIn;
  }
  public set isSignedIn(isSignedIn: boolean|undefined) {
    if (this._isSignedIn != isSignedIn) {
      this._isSignedIn = isSignedIn;
      this.notifyIsSignedInDefined();
    }
  }

  public isSignedInDefinedEvent = new EventEmitter();

  public constructor(
    private http: HttpClient,
    private sessionStorageService: SessionStorageService
    ) { 
      const app: FirebaseApp = initializeApp(environment.firebaseConfig);
      this.firebaseAuth = getAuth(app);
  
      this.onAuthStateChangedUnsubscribe = this.firebaseAuth.onAuthStateChanged(
        user => this.onFirebaseAuthStateChange(user)
      );
  }

  public ngOnDestroy(): void {
    this.signInLocallySubscription?.unsubscribe();
    this.onAuthStateChangedUnsubscribe();
  }

  private createUser(userCredential: UserCredential, signUpUser: SignUpUser): Observable<UserInfo> {
    const createUserDto: CreateUserDto = UserService.fromSignUpUserToCreateUserDto(userCredential.user.uid, signUpUser);
    const body: string = JSON.stringify(createUserDto);

    return this.getFirebaseJWT()
    .pipe(
      exhaustMap(token => {
        const headers: HttpHeaders= new HttpHeaders()
          .set('Content-type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`);
        
        return this.http.post<LoadUserDto>(
            `${environment.apiUrl}${UserService.apiPath}`,
            body,
            { 'headers': headers }
          )
      }),
      map(LoadUserDto => 
        UserService.fromLoadUserDtoToUserInfo(LoadUserDto)
      )
    );
  }

  private loadUserFromFirebaseId(firebaseId: string): Observable<UserInfo> {
    return this.getFirebaseJWT()
    .pipe(
      exhaustMap(token => {
        const headers: HttpHeaders= new HttpHeaders()
          .set('Content-type', 'application/json')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`);

        return this.http.get<LoadUserDto[]>(
            `${environment.apiUrl}${UserService.apiPath}?firebaseId=${firebaseId}`,
            { 'headers': headers }
          )
      }),
      map(loadUserDtos => 
          UserService.fromLoadUserDtoToUserInfo(loadUserDtos[0])
      )
    );
  }

  public signUp(signUpUser: SignUpUser): Observable<UserInfo|undefined> {
    return this.firebaseSetPersistenceToLocal()
      .pipe(
        exhaustMap(() => 
          this.firebaseCreateUserWithEmailAndPassword(signUpUser.email, signUpUser.password)
        ),
        exhaustMap(userCredential =>  
          // Enregistrement des informations spécifiques à l'application.
          this.createUser(userCredential, signUpUser)
        ),
        exhaustMap(userInfo => 
          this.signInLocally(userInfo?.firebaseId)
        )
      );
  }

  private signInLocally(firebaseId: string): Observable<UserInfo> {
    return this.loadUserFromFirebaseId(firebaseId)
      .pipe(
        tap(userInfo => {
          this.sessionStorageService.saveData(UserService.userInfoSessionStorageKey, JSON.stringify(userInfo));
          this.isSignedIn = true;
         })
      );
  }

  public refreshCurrentUser(): Observable<UserInfo|undefined> {
    const currentUserInfo: UserInfo|undefined = this.getCurrentUserInfo();
    if (currentUserInfo) {
      return this.loadUserFromFirebaseId(currentUserInfo.firebaseId)
        .pipe(
          tap(userInfo => 
              this.sessionStorageService.saveData(UserService.userInfoSessionStorageKey, JSON.stringify(userInfo))
          )
        );
    }

    return of(undefined);
  }

  public signIn(signInUser: SignInUser): Observable<UserInfo|undefined> {
    return this.firebaseSetPersistenceToLocal()
    .pipe(
      exhaustMap(() =>  
        this.firebaseSignInWithEmailAndPassword(signInUser.email, signInUser.password)
      ),
      exhaustMap(userCredential => 
        this.signInLocally(userCredential.user.uid)
      )
    );
  }

  private onFirebaseAuthStateChange(user: User|null): void {
    if (user) {
      this.signInLocallySubscription = this.signInLocally(user.uid).subscribe();
    } else {
      this.isSignedIn = false;
    }
  }

  public notifyIsSignedInDefined(): void {
    this.isSignedInDefinedEvent.emit();
  }

  public getCurrentUserInfo(): UserInfo|undefined {
    if (this.isSignedIn) {
      return JSON.parse(this.sessionStorageService.getData(UserService.userInfoSessionStorageKey));
    }
    return undefined;
  }

  public getFirebaseJWT(): Observable<string | undefined> {
    if (this.firebaseAuth.currentUser) {
      return from(this.firebaseAuth.currentUser.getIdToken())
      .pipe(
        tap(token => console.log(token))
      );
    }
    return of(undefined);
  }

  public firebaseSetPersistenceToLocal(): Observable<void> {
    return from(setPersistence(this.firebaseAuth, browserLocalPersistence));
  }

  public firebaseCreateUserWithEmailAndPassword(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.firebaseAuth, email, password));
  }

  public signOutLocally(): void {
    this.sessionStorageService.removeData(UserService.userInfoSessionStorageKey);
    this.isSignedIn = false;
  }

  public signOut(): Observable<void> {
    return from(signOut(this.firebaseAuth))
    .pipe(
      tap(() => this.signOutLocally())
    );
  }

  public firebaseSignInWithEmailAndPassword(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password));
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