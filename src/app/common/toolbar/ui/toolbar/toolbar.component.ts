import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from 'src/app/user/service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from 'src/app/user/route/user.routes';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './toolbar.component.html',
  styles: [
  ]
})
export class ToolbarComponent {
  public constructor(private location: Location, private router: Router, private userService: UserService) {}

  public goBack(): void {
    this.location.back();
  }

  public signOut(): void {
    this.userService.signOut().subscribe(() => { this.router.navigate([UserRoutes.signInUserRoute]); });
  }
}
