import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { UserRoutes } from '../user.routes';

@Component({
  selector: 'app-signup-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signup-user.component.html',
  styles: [
  ]
})
export class SignupUserComponent {
  constructor(private userService: UserService, private router: Router) { }

  signup(): void {
    this.userService.signup();
  }

  goToSignin() {
    this.router.navigate([UserRoutes.signinUserRoute]);
  }
}
