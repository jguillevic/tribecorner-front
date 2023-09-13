import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, map, switchMap, tap } from 'rxjs';
import { FamilyService } from '../../service/family.service';
import { Router } from '@angular/router';
import { FamilyRoutes } from '../../route/family.routes';
import { FormsModule } from '@angular/forms';
import { HomeRoutes } from 'src/app/home/route/home.routes';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { UserService } from 'src/app/user/service/user.service';

@Component({
  selector: 'app-create-family',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './create-family.component.html',
  styles: [
  ]
})
export class CreateFamilyComponent implements OnDestroy {
  private createSubscription: Subscription|undefined;

  public familyName: string|undefined;

  public constructor(
    private router: Router,
    private familyService: FamilyService,
    private userService: UserService
    ) { }

  public ngOnDestroy(): void {
    this.createSubscription?.unsubscribe();
  }

  public createFamily(): void {
    if (this.familyName) {
      const currentUserInfo: UserInfo|undefined = this.userService.getCurrentUserInfo();

      if (currentUserInfo) {
        this.createSubscription = this.familyService
        .create(this.familyName, currentUserInfo.id)
        .pipe(
          switchMap(() => {
            return this.userService.refreshCurrentUser();
          })
        )
        .subscribe(
          () => {
            return this.router.navigate([HomeRoutes.displayHomeRoute]); 
          });
      }
    }
  }

  public goToJoinFamily(): Promise<boolean> {
    return this.router.navigate([FamilyRoutes.joinFamilyRoute]);
  }
}
