import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { UserService } from 'src/app/user/service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from 'src/app/user/route/user.routes';
import { SignOutButtonComponent } from "../../../buttons/sign-out/ui/sign-out-button.component";

@Component({
    selector: 'app-profile-top-bar',
    standalone: true,
    templateUrl: './profile-top-bar.component.html',
    styles: [],
    imports: [
        CommonModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        SignOutButtonComponent
    ]
})
export class ProfileTopBarComponent implements OnInit, OnDestroy {
  private signOutSubscription: Subscription|undefined;

  public currentUserInfo: UserInfo|undefined;

  public constructor(
    private userService: UserService,
    private router: Router
    ) { }

    public ngOnInit(): void {
      this.currentUserInfo = this.userService.getCurrentUserInfo();
    }
  
    public ngOnDestroy(): void {
      this.signOutSubscription?.unsubscribe();
    }

  public signOut(): Promise<boolean>|boolean {
    this.signOutSubscription = this.userService.signOut()
    .subscribe(() => 
      { 
        return this.router.navigate([ UserRoutes.signInUserRoute ]);
      }
    );
    return false;
  }

  public getUsernameFirstLetterUpperCase(): string {
    if (this.currentUserInfo) {
      return Array.from(this.currentUserInfo.username)[0].toUpperCase();
    }
    return '';
  }
}
