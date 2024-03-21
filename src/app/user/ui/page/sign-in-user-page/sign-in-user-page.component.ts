import {Component, OnDestroy} from '@angular/core';
import {UserService} from '../../../service/user.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {Subscription} from 'rxjs';
import {FamilyRoutes} from 'src/app/family/route/family.routes';
import {UserInfo} from '../../../model/user-info.model';
import {FirebaseError} from 'firebase/app';
import {MtxButtonModule} from '@ng-matero/extensions/button';
import {MatIconModule} from '@angular/material/icon';
import {SignInUser} from '../../../model/sign-in-user.model';
import {UserRoutes} from '../../../route/user.routes';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-sign-in-user-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MtxButtonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule
],
  templateUrl: './sign-in-user-page.component.html'
})
export class SignInUserComponent implements OnDestroy {
  private signInSubscription: Subscription|undefined;

  public hidePassword: boolean = true;
  public isSigningIn: boolean = false;
  public isGoingToSignUp: boolean = false;

  // Formulaire.
  public readonly emailMaxLength: number = 255; 
  public readonly passwordMaxLength: number = 255;
  public readonly signInForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(this.emailMaxLength)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(this.passwordMaxLength)]),
      rememberMe: new FormControl(false, [Validators.required])
    }
  );

  public constructor(
    private userService: UserService,
    private router: Router
    ) { }

  public ngOnDestroy(): void {
    this.signInSubscription?.unsubscribe();
  }

  private goToCreateFamily(userInfo: UserInfo|undefined): Promise<boolean>|void {
    if (userInfo) {
      return this.router.navigate([FamilyRoutes.createFamilyRoute]);
    }
  }

  private handleError(error: any): void {
    this.isSigningIn = false;

    if (error instanceof(FirebaseError)) {
      if (error.code === "auth/user-not-found") {
        this.signInForm.controls['email'].setErrors({'not-found': true});
      }
      if (error.code === "auth/wrong-password") {
        this.signInForm.controls['password'].setErrors({'wrong': true});
      }
    } else {
      window.alert("Problème technique. Veuillez réessayer dans quelques minutes.");
      console.log(error);
    }
  }

  public signIn(): Promise<boolean>|void {
    if (this.signInForm.valid) {
      this.isSigningIn = true;

      const signInUser: SignInUser 
      = this.signInForm.value as SignInUser;

      this.signInSubscription 
      = this.userService.signIn(signInUser)
      .subscribe({ 
        next: (userInfo) => this.goToCreateFamily(userInfo),
        error : (error) => this.handleError(error)
      });
    }
  }

  public goToSignUp(): Promise<boolean> {
    this.isGoingToSignUp = true;

    return this.router.navigate([UserRoutes.signUpUserRoute]);
  }
}