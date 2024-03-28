import {Component, OnDestroy} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Router} from '@angular/router';
import {UserService} from '../../../../user/service/user.service';
import {UserRoutes} from '../../../../user/route/user.routes';
import {Subscription, from, map} from 'rxjs';
import {MtxButtonModule} from '@ng-matero/extensions/button';

@Component({
  selector: 'app-sign-out-button',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MtxButtonModule
],
  templateUrl: './sign-out-button.component.html',
  styles: [
  ]
})
export class SignOutButtonComponent implements OnDestroy {
  private signOutSubscription: Subscription|undefined;
  
  public isSigningOut: boolean = false;

  public constructor(
    private userService: UserService
    ) { }

  public ngOnDestroy(): void {
    this.signOutSubscription?.unsubscribe();
  }

  public signOut(): void {
    this.isSigningOut = true;
    this.signOutSubscription 
    = this.userService.signOut()
    .subscribe();
  }
}