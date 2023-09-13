import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TabBarComponent } from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from 'src/app/user/service/user.service';
import { UserRoutes } from 'src/app/user/route/user.routes';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { FamilyService } from 'src/app/family/service/family.service';
import { Family } from 'src/app/family/model/family.model';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-display-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabBarComponent,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule
  ],
  templateUrl: './display-home.component.html',
  styles: [
  ]
})
export class DisplayHomeComponent implements OnInit, OnDestroy {
  private loadSubscription: Subscription|undefined;
  private signOutSubscription: Subscription|undefined;

  public currentUserInfo: UserInfo|undefined;
  public family: Family|undefined;

  public constructor(
    private familyService: FamilyService,
    private userService: UserService,
    private router: Router
    ) { }

  public ngOnInit(): void {
    this.currentUserInfo = this.userService.getCurrentUserInfo();

    if (this.currentUserInfo?.familyId) {
      this.loadSubscription = this.familyService.load(this.currentUserInfo.familyId).subscribe((family) => this.family = family);
    }
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.signOutSubscription?.unsubscribe();
  }

  public signOut(): void {
    this.signOutSubscription = this.userService.signOut()
    .subscribe(() => 
      { 
        return this.router.navigate([ UserRoutes.signInUserRoute ]);
      }
    );
  }
}