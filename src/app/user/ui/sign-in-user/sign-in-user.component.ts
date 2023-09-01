import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from '../../route/user.routes';
import { FormsModule } from '@angular/forms';
import { SignInUser } from '../../model/sign-in-user';
import { ShoppingListRoutes } from 'src/app/shopping-list/route/shopping-list.routes';

@Component({
  selector: 'app-sign-in-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-in-user.component.html',
  styles: [
  ]
})
export class SignInUserComponent {
  public signInUser = new SignInUser();

  constructor(private userService: UserService, private router: Router) { }

  signIn(): void {
    this.userService.signIn(this.signInUser)
    .subscribe((userInfo) => {
      if (!userInfo) { 
        window.alert("Problème rencontré lors de l'authentification !"); 
      } else {
        this.router.navigate([ShoppingListRoutes.editShoppingListRoute]);
      }
    });
  }

  goToSignUp() {
    this.router.navigate([UserRoutes.signUpUserRoute]);
  }
}