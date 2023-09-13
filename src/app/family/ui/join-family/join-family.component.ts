import { Component, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-join-family',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './join-family.component.html',
  styles: [
  ]
})
export class JoinFamilyComponent implements OnDestroy {
  private joinSubscription: Subscription|undefined;

  public familyAssociationCode: string|undefined;

  public constructor(
    private router: Router,
    private familyService: FamilyService,
    private userService: UserService
    ) { }

  ngOnDestroy(): void {
    this.joinSubscription?.unsubscribe();
  }

  public joinFamily(): void {
    if (this.familyAssociationCode) {
      const currentUserInfo: UserInfo|undefined = this.userService.getCurrentUserInfo();

      if (currentUserInfo) {
        this.joinSubscription = this.familyService.joinFamily(this.familyAssociationCode, currentUserInfo.id)
        .pipe(
          switchMap(() => {
            return this.userService.refreshCurrentUser();
          })
        )
        .subscribe(() => {
          return this.router.navigate([HomeRoutes.displayHomeRoute]); 
        });
      }
    }
  }

  public goToCreateFamily(): Promise<boolean> {
    return this.router.navigate([FamilyRoutes.createFamilyRoute]);
  }
}