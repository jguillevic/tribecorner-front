import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from '../../route/user.routes';
import { FormsModule } from '@angular/forms';
import { SignUpUser } from '../../model/sign-up-user';

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

  constructor(private userService: UserService, private router: Router) { }

  signUp(): void {
    this.userService.signUp(this.signUpUser);
  }

  goToSignIn() {
    this.router.navigate([UserRoutes.signInUserRoute]);
  }
}