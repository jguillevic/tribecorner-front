import { Component, OnDestroy, OnInit } from '@angular/core';

import { UserService } from 'src/app/user/service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from 'src/app/user/route/user.routes';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomeRoutes } from 'src/app/home/route/home.routes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-display-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './display-loading.component.html',
  styles: [
  ]
})
export class DisplayLoadingComponent implements OnInit, OnDestroy {
  private isSignedInDefinedEventSubscription: Subscription|undefined;

  constructor(private userService: UserService, private router: Router) { }

  public ngOnInit(): void {
    if (this.userService.isSignedIn === undefined)
    {
      this.isSignedInDefinedEventSubscription = this.userService.isSignedInDefinedEvent.subscribe(() => {
        this.navigateTo(this.userService.isSignedIn === true);
      });
    } else {
      this.navigateTo(this.userService.isSignedIn === false);
    }
  }

  ngOnDestroy(): void {
    this.isSignedInDefinedEventSubscription?.unsubscribe();
  }

  private navigateTo(isSignedIn: boolean) : Promise<boolean> {
    if (isSignedIn === true) {
      return this.router.navigate([HomeRoutes.displayHomeRoute]);
    }
    return this.router.navigate([UserRoutes.signInUserRoute]);
  }
}