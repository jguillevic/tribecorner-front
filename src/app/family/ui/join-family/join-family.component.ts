import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { FamilyService } from '../../service/family.service';
import { Router } from '@angular/router';
import { FamilyRoutes } from '../../route/family.routes';
import { Subscription, switchMap } from 'rxjs';
import { UserService } from 'src/app/user/service/user.service';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { HomeRoutes } from 'src/app/home/route/home.routes';
import { SignOutButtonComponent } from "../../../common/buttons/sign-out/ui/sign-out-button.component";
import { ButtonWithSpinnerDirective } from 'src/app/common/directives/button-with-spinner.directive';

@Component({
    selector: 'app-join-family',
    standalone: true,
    templateUrl: './join-family.component.html',
    styles: [],
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        SignOutButtonComponent,
        ButtonWithSpinnerDirective
    ]
})
export class JoinFamilyComponent implements OnInit, OnDestroy {
  private joinSubscription: Subscription|undefined;

  public familyAssociationCode: string|undefined;
  public currentUserInfo: UserInfo|undefined;
  public isJoiningFamily: boolean = false;
  public isGoingToCreateFamily: boolean = false;

  public constructor(
    private router: Router,
    private familyService: FamilyService,
    private userService: UserService
    ) { }

  public ngOnInit(): void {
    this.currentUserInfo = this.userService.getCurrentUserInfo();
  }

  public ngOnDestroy(): void {
    this.joinSubscription?.unsubscribe();
  }

  public joinFamily(): void {
    this.isJoiningFamily = true;
    if (this.familyAssociationCode && this.currentUserInfo) {
      this.joinSubscription = this.familyService.joinFamily(this.familyAssociationCode, this.currentUserInfo.id)
      .pipe(
        switchMap(() => {
          return this.userService.refreshCurrentUser();
        })
      )
      .subscribe({
        next: () => {
        return this.router.navigate([HomeRoutes.displayHomeRoute]); 
        },
        error: (error) => { 
          this.isJoiningFamily = false; 
        }
      });
    }
  }

  public goToCreateFamily(): Promise<boolean> {
    this.isGoingToCreateFamily = true;
    return this.router.navigate([FamilyRoutes.createFamilyRoute]);
  }
}