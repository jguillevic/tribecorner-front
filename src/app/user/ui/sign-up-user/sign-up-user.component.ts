import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from '../../route/user.routes';
import { FormsModule } from '@angular/forms';
import { SignUpUser } from '../../model/sign-up-user';
import { ShoppingListRoutes } from 'src/app/shopping-list/route/shopping-list.routes';

@Component({
  selector: 'app-sign-up-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up-user.component.html',
  styles: [
  ]
})
export class SignUpUserComponent {
  public signUpUser: SignUpUser = new SignUpUser();
  public displaySignUpMessage: boolean = false;

  public constructor(private userService: UserService, private router: Router) { }

  public signUp(): void {
    this.displaySignUpMessage = true;

    this.userService.signUp(this.signUpUser)
    .subscribe((userInfo) => { 
      if (!userInfo) { 
        window.alert("Problème rencontré lors de la création du compte !"); 
      } else {
        this.router.navigate([ShoppingListRoutes.editShoppingListRoute]);
      }
    });  
  }

  public goToSignIn() {
    this.router.navigate([UserRoutes.signInUserRoute]);
  }
}