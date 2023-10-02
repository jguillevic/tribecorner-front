import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, switchMap } from 'rxjs';
import { FamilyService } from '../../service/family.service';
import { Router } from '@angular/router';
import { FamilyRoutes } from '../../route/family.routes';
import { FormsModule } from '@angular/forms';
import { HomeRoutes } from 'src/app/home/route/home.routes';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { UserService } from 'src/app/user/service/user.service';
import { ButtonWithSpinnerDirective } from 'src/app/common/button/directive/button-with-spinner.directive';
import { SignOutButtonComponent } from 'src/app/common/button/ui/sign-out/sign-out-button.component';

@Component({
    selector: 'app-create-family',
    standalone: true,
    templateUrl: './create-family.component.html',
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
export class CreateFamilyComponent implements OnInit, OnDestroy {
  private createSubscription: Subscription|undefined;

  public familyName: string|undefined;
  public currentUserInfo: UserInfo|undefined;
  public isCreatingFamily: boolean = false;
  public isGoingToJoinFamily: boolean = false;

  public constructor(
    private router: Router,
    private familyService: FamilyService,
    private userService: UserService
    ) { }

  public ngOnInit(): void {
    this.currentUserInfo = this.userService.getCurrentUserInfo();
  }

  public ngOnDestroy(): void {
    this.createSubscription?.unsubscribe();
  }

  public createFamily(): void {
    this.isCreatingFamily = true;    
    if (this.familyName && this.currentUserInfo) {
      this.createSubscription = this.familyService
      .create(this.familyName, this.currentUserInfo.id)
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
          this.isCreatingFamily = false; 
        }
      });
    }
  }

  public goToJoinFamily(): Promise<boolean> {
    this.isGoingToJoinFamily = true;
    return this.router.navigate([FamilyRoutes.joinFamilyRoute]);
  }
}
