import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, map } from 'rxjs';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { UserService } from 'src/app/user/service/user.service';
import { Router } from '@angular/router';
import { UserRoutes } from 'src/app/user/route/user.routes';
import { MatDividerModule } from '@angular/material/divider';
import { FamilyRoutes } from 'src/app/family/route/family.routes';
import { SignOutButtonComponent } from 'src/app/common/button/ui/sign-out/sign-out-button.component';

@Component({
    selector: 'app-profile-top-bar',
    standalone: true,
    templateUrl: './profile-top-bar.component.html',
    styleUrls: ['./profile-top-bar.component.scss'],
    imports: [
        CommonModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        SignOutButtonComponent,
        MatDividerModule
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

  public getUsernameFirstLetterUpperCase(): string {
    if (this.currentUserInfo) {
      return Array.from(this.currentUserInfo.username)[0].toUpperCase();
    }
    return '';
  }

  public goToDisplayUser(): Promise<boolean> {
    return this.router.navigate([UserRoutes.displayUserRoute]);
  }

  public goToDisplayFamily(): Promise<boolean> {
    return this.router.navigate([FamilyRoutes.displayFamilyRoute]);
  }

  public signOut(): void{
    this.signOutSubscription = this.userService.signOut()
    .pipe(
      map(() => this.router.navigate([UserRoutes.signInUserRoute]))
    )
    .subscribe();
  }
}
