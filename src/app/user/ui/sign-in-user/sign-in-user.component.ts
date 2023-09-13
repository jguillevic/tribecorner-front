import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from '../../route/user.routes';
import { FormsModule } from '@angular/forms';
import { SignInUser } from '../../model/sign-in-user.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HomeRoutes } from 'src/app/home/route/home.routes';
import { Subscription } from 'rxjs';
import { FamilyRoutes } from 'src/app/family/route/family.routes';

@Component({
  selector: 'app-sign-in-user',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './sign-in-user.component.html',
  styles: [
  ]
})
export class SignInUserComponent implements OnDestroy {
  private signInSubscription: Subscription|undefined;

  public signInUser = new SignInUser();

  constructor(private userService: UserService, private router: Router) { }

  ngOnDestroy(): void {
    this.signInSubscription?.unsubscribe();
  }

  signIn(): Promise<boolean>|void {
    this.signInSubscription = this.userService.signIn(this.signInUser)
    .subscribe((userInfo) => {
      if (!userInfo) { 
        window.alert("Problème rencontré lors de l'authentification !");
      } else {
        return this.router.navigate([FamilyRoutes.createFamilyRoute]);
      }
      return;
    });
  }

  goToSignUp(): Promise<boolean> {
    return this.router.navigate([UserRoutes.signUpUserRoute]);
  }
}