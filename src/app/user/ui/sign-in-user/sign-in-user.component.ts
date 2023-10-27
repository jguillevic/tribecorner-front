import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from '../../route/user.routes';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignInUser } from '../../model/sign-in-user.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { FamilyRoutes } from 'src/app/family/route/family.routes';
import { UserInfo } from '../../model/user-info.model';
import { FirebaseError } from 'firebase/app';
import { ButtonWithSpinnerDirective } from 'src/app/common/button/directive/button-with-spinner.directive';

@Component({
  selector: 'app-sign-in-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ButtonWithSpinnerDirective
  ],
  templateUrl: './sign-in-user.component.html',
  styles: [
  ]
})
export class SignInUserComponent implements OnDestroy {
  private signInSubscription: Subscription|undefined;

  private _isSigningIn: boolean = false;
  public get isSigningIn(): boolean {
    return this._isSigningIn;
  }
  public set isSigningIn(value: boolean) {
    this._isSigningIn = value;
  }

  private _isGoingToSignUp: boolean = false;
  public get isGoingToSignUp(): boolean {
    return this._isGoingToSignUp;
  }
  public set isGoingToSignUp(value: boolean) {
    this._isGoingToSignUp = value;
  }

  // Formulaire.
  private readonly _emailMaxLength: number = 255; 
  public get emailMaxLength(): number {
    return this._emailMaxLength;
  }

  private readonly _passwordMaxLength: number = 255;
  public get passwordMaxLength(): number {
    return this._passwordMaxLength;
  }

  private readonly _signInForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(this.emailMaxLength)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(this.passwordMaxLength)])
    }
  );
  public get signInForm(): FormGroup {
    return this._signInForm;
  }

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
    }
  }

  public signIn(): Promise<boolean>|void {
    if (this.signInForm.valid) {
      this.isSigningIn = true;

      const signInUser: SignInUser = new SignInUser();
      signInUser.email = this.signInForm.controls['email'].value;
      signInUser.password = this.signInForm.controls['password'].value;

      this.signInSubscription = this.userService.signIn(signInUser)
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