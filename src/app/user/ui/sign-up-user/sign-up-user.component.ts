import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from '../../route/user.routes';
import { SignUpUser } from '../../model/sign-up-user.model';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { FamilyRoutes } from 'src/app/family/route/family.routes';
import { ButtonWithSpinnerDirective } from 'src/app/common/button/directive/button-with-spinner.directive';

@Component({
  selector: 'app-sign-up-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  private signUpSubscription: Subscription|undefined;

  public signUpUser: SignUpUser = new SignUpUser();
  public isSigningUp: boolean = false;
  public isGoingToSignIn: boolean = false;

  public constructor(private userService: UserService, private router: Router) { }

  public ngOnDestroy(): void {
    this.signUpSubscription?.unsubscribe();
  }

  public signUp(): Promise<boolean>|void {
    this.isSigningUp = true;

    this.userService.signUp(this.signUpUser)
    .subscribe((userInfo) => { 
      if (!userInfo) { 
        window.alert("Problème rencontré lors de la création du compte !");
        this.isSigningUp = false;
      } else {
        return this.router.navigate([FamilyRoutes.createFamilyRoute]);
      }
      return;
    });
  }

  public goToSignIn(): Promise<boolean> {
    this.isGoingToSignIn = true;

    return this.router.navigate([UserRoutes.signInUserRoute]);
  }
}