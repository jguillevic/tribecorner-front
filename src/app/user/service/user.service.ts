import {Injectable, OnDestroy, inject} from '@angular/core';
import {SignUpUser} from '../model/sign-up-user.model';
import {UserInfo} from '../model/user-info.model';
import {BehaviorSubject, Observable, Subject, exhaustMap, from, map, mergeMap, of, takeUntil, tap} from 'rxjs';
import {SignInUser} from '../model/sign-in-user.model';
import {CreateUserDto} from '../dto/create-user.dto';
import {LoadUserDto} from '../dto/load-user.dto';
import {SessionStorageService} from '../../common/storage/service/session-storage.service';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserConverter} from '../converter/user.converter';
import {Auth, User, UserCredential, authState, browserLocalPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import {setPersistence} from '@firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  private static readonly apiPath: string = 'users';
  private static readonly userInfoSessionStorageKey: string = 'userInfo';

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();
  private readonly firebaseAuth: Auth = inject(Auth);
  private readonly firebaseAuthState$ = authState(this.firebaseAuth);

  private readonly isSignedInSubject: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined);
  public readonly isSignedIn$: Observable<boolean | undefined> = this.isSignedInSubject.asObservable();

  public constructor(
    private readonly http: HttpClient,
    private readonly sessionStorageService: SessionStorageService
    ) {
      this.firebaseAuthState$
      .pipe(
        takeUntil(this.destroy$),
        mergeMap(user => this.firebaseAuthStateChange(user))
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private createUser(userCredential: UserCredential, signUpUser: SignUpUser): Observable<UserInfo> {
    const createUserDto: CreateUserDto = UserConverter.fromModelToDto(userCredential.user.uid, signUpUser);
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
      map((loadUserDto: LoadUserDto) => 
        UserConverter.fromDtoToModel(loadUserDto)
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
      map((loadUserDtos: LoadUserDto[]) => 
          UserConverter.fromDtoToModel(loadUserDtos[0])
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
          this.isSignedInSubject.next(true);
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
      exhaustMap((userCredential: UserCredential) => 
        this.signInLocally(userCredential.user.uid)
      )
    );
  }

  private firebaseAuthStateChange(user: User|null): Observable<UserInfo|undefined> {
    if (user) {
      return this.signInLocally(user.uid)
    } 

    this.isSignedInSubject.next(false);
    return of(undefined);
  }

  public getCurrentUserInfo(): UserInfo|undefined {
    if (this.isSignedInSubject.value) {
      return JSON.parse(this.sessionStorageService.getData(UserService.userInfoSessionStorageKey));
    }
    return undefined;
  }

  public getFirebaseJWT(): Observable<string|undefined> {
    if (this.firebaseAuth.currentUser) {
      return from(this.firebaseAuth.currentUser.getIdToken());
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
    this.isSignedInSubject.next(false);
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
}