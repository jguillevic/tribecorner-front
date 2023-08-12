import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { UserRoutes } from '../user.routes';

@Component({
  selector: 'app-signin-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signin-user.component.html',
  styles: [
  ]
})
export class SigninUserComponent {
  constructor(private userService: UserService, private router: Router) { }

  signin(): void {
    this.userService.signin();
  }

  goToSignup() {
    this.router.navigate([UserRoutes.signupUserRoute]);
  }
}
