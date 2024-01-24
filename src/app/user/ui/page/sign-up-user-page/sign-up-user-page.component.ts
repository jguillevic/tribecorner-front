import { Component, OnDestroy } from '@angular/core';

import { UserService } from '../../../service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from '../../../route/user.routes';
import { SignUpUser } from '../../../model/sign-up-user.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { FamilyRoutes } from 'src/app/family/route/family.routes';
import { UserInfo } from '../../../model/user-info.model';
import { FirebaseError } from 'firebase/app';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sign-up-user-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MtxButtonModule,
    MatIconModule
],
  templateUrl: './sign-up-user-page.component.html',
  styles: [
  ]
})
export class SignUpUserComponent implements OnDestroy {
  private signUpSubscription: Subscription|undefined;

  public hidePassword: boolean = true;
  public isSigningUp: boolean = false;
  public isGoingToSignIn: boolean = false;

  // Formulaire.
  public readonly usernameMaxLength: number = 255; 
  public readonly emailMaxLength: number = 255; 
  public readonly passwordMaxLength: number = 255;
  public readonly passwordRegex: string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

  public readonly signUpForm: FormGroup = new FormGroup(
    {
      username: new FormControl('', [Validators.required, Validators.maxLength(this.usernameMaxLength)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(this.emailMaxLength)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(this.passwordMaxLength), Validators.pattern(this.passwordRegex)])
    }
  );

  public constructor(
    private userService: UserService,
    private router: Router
  ) { }

  public ngOnDestroy(): void {
    this.signUpSubscription?.unsubscribe();
  }

  private goToCreateFamily(userInfo: UserInfo|undefined): Promise<boolean>|void {
    if (userInfo) {
      return this.router.navigate([FamilyRoutes.createFamilyRoute]);
    }
  }

  private handleError(error: any): void {
    this.isSigningUp = false;

    if (error instanceof(FirebaseError)) {
      if (error.code === "auth/email-already-in-use") {
        this.signUpForm.controls['email'].setErrors({'already-in-use': true});
      }
    } else {
      window.alert("Problème technique. Veuillez réessayer dans quelques minutes.");
    }
  }

  public signUp(): Promise<boolean>|void {
    if (this.signUpForm.valid) {
      this.isSigningUp = true;

      const signUpUser: SignUpUser 
      = this.signUpForm.value as SignUpUser;

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