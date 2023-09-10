import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from '../../route/user.routes';
import { SignUpUser } from '../../model/sign-up-user.model';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HomeRoutes } from 'src/app/home/route/home.routes';

@Component({
  selector: 'app-sign-up-user',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule],
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
        this.router.navigate([HomeRoutes.displayHomeRoute]);
      }
    });  
  }

  public goToSignIn() {
    this.router.navigate([UserRoutes.signInUserRoute]);
  }
}