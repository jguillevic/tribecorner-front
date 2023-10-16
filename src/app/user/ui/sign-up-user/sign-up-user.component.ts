import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from '../../route/user.routes';
import { SignUpUser } from '../../model/sign-up-user.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { FamilyRoutes } from 'src/app/family/route/family.routes';
import { ButtonWithSpinnerDirective } from 'src/app/common/button/directive/button-with-spinner.directive';
import { UserInfo } from '../../model/user-info.model';
import { FirebaseError } from 'firebase/app';

@Component({
  selector: 'app-sign-up-user',
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
  templateUrl: './sign-up-user.component.html',
  styles: [
  ]
})
export class SignUpUserComponent implements OnDestroy {
  private _signUpSubscription: Subscription|undefined;

  private _isSigningUp: boolean = false;
  public get isSigningUp(): boolean {
    return this._isSigningUp;
  }
  public set isSigningUp(value: boolean) {
    this._isSigningUp = value;
  }

  private _isGoingToSignIn: boolean = false;
  public get isGoingToSignIn(): boolean {
    return this._isGoingToSignIn;
  }
  public set isGoingToSignIn(value: boolean) {
    this._isGoingToSignIn = value;
  }

  // Formulaire.
  private readonly _usernameMaxLength: number = 255; 
  public get usernameMaxLength(): number {
    return this._usernameMaxLength;
  }

  private readonly _emailMaxLength: number = 255; 
  public get emailMaxLength(): number {
    return this._emailMaxLength;
  }

  private readonly _passwordMaxLength: number = 255;
  public get passwordMaxLength(): number {
    return this._passwordMaxLength;
  }

  private readonly _passwordRegex: string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
  public get passwordRegex(): string {
    return this._passwordRegex;
  }

  private readonly _signUpForm: FormGroup = new FormGroup(
    {
      username: new FormControl('', [Validators.required, Validators.maxLength(this.usernameMaxLength)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(this.emailMaxLength)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(this.passwordMaxLength), Validators.pattern(this.passwordRegex)])
    }
  );
  public get signUpForm(): FormGroup {
    return this._signUpForm;
  }

  public constructor(
    private userService: UserService,
    private router: Router
    ) { }

  public ngOnDestroy(): void {
    this._signUpSubscription?.unsubscribe();
  }

  private goToCreateFamily(userInfo: UserInfo|undefined): Promise<boolean>|void {
    if (userInfo) {
      return this.router.navigate([FamilyRoutes.createFamilyRoute]);
    }
  }

  private handleError(error: any): void {
    this.isSigningUp = false;

    if (error instanceof(FirebaseError)) {
      if (error.code == "auth/email-already-in-use") {
        this.signUpForm.controls['email'].setErrors({'already-in-use': true});
      }
    } else {
      window.alert("Problème technique. Veuillez réessayer dans quelques minutes.");
    }
  }

  public signUp(): Promise<boolean>|void {
    if (this.signUpForm.valid) {
      this.isSigningUp = true;

      const signUpUser: SignUpUser = new SignUpUser();
      signUpUser.username = this.signUpForm.controls['username'].value;
      signUpUser.email = this.signUpForm.controls['email'].value;
      signUpUser.password = this.signUpForm.controls['password'].value;

      this.userService.signUp(signUpUser)
      .subscribe({ 
        next: (userInfo) => this.goToCreateFamily(userInfo),
        error : (error) => this.handleError(error)
      });
    }
  }

  public goToSignIn(): Promise<boolean> {
    this.isGoingToSignIn = true;

    return this.router.navigate([UserRoutes.signInUserRoute]);
  }
}