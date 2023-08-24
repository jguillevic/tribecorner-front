import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from '../../route/user.routes';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-in-user.component.html',
  styles: [
  ]
})
export class SignInUserComponent {
  public email: string = '';
  public password: string = '';

  constructor(private userService: UserService, private router: Router) { }

  signIn(): void {
    this.userService.signIn(this.email, this.password);
  }

  goToSignUp() {
    this.router.navigate([UserRoutes.signUpUserRoute]);
  }
}
