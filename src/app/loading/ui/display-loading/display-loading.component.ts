import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/user/service/user.service';
import { Router } from '@angular/router';
import { ShoppingListRoutes } from 'src/app/shopping-list/route/shopping-list.routes';
import { UserRoutes } from 'src/app/user/route/user.routes';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-display-loading',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './display-loading.component.html',
  styles: [
  ]
})
export class DisplayLoadingComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) { }

  public ngOnInit(): void {
    if (this.userService.isSignedIn == undefined)
    {
      this.userService.isSignedInDefinedEvent.subscribe(() => {
        this.navigateTo(this.userService.isSignedIn == true);
      });
    } else {
      this.navigateTo(this.userService.isSignedIn);
    }
  }

  private navigateTo(isSignedIn: boolean) : Promise<boolean> {
    if (isSignedIn == true) {
      return this.router.navigate([ShoppingListRoutes.editShoppingListRoute]);
    }
    return this.router.navigate([UserRoutes.signInUserRoute]);
  }
}