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
import { ButtonWithSpinnerDirective } from 'src/app/common/directives/button-with-spinner.directive';

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

  public readonly emailMaxLength: number = 255; 
  public readonly passwordMaxLength: number = 255;
  public readonly passwordRegex: string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
  public hasUserNotFoundError: boolean = false;
  public hasWrongPasswordError: boolean = false;
  public isSigningIn: boolean = false;
  public isGoingToSignUp: boolean = false;

  public signInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(1), Validators.maxLength(this.emailMaxLength)]),
    password: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(this.passwordMaxLength), Validators.pattern(this.passwordRegex)])
  },
  { updateOn: 'submit' });

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
      if (error.code == "auth/user-not-found") {
        this.signInForm.controls['email'].setErrors({'not-found': true});
      }
      if (error.code == "auth/wrong-password") {
        this.signInForm.controls['password'].setErrors({'wrong': true});
      }
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