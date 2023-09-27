import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TabBarComponent } from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from 'src/app/user/service/user.service';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ShoppingListService } from 'src/app/shopping-list/service/shopping-list.service';
import { ShoppingList } from 'src/app/shopping-list/model/shopping-list.model';
import { ShoppingListRoutes } from 'src/app/shopping-list/route/shopping-list.routes';
import { ShoppingListCardComponent } from "../../../shopping-list/ui/shopping-list-card/shopping-list-card.component";
import { ProfileTopBarComponent } from 'src/app/common/top-bar/profile/ui/profile-top-bar.component';

@Component({
    selector: 'app-display-home',
    standalone: true,
    templateUrl: './display-home.component.html',
    styles: [],
    imports: [
        CommonModule,
        FormsModule,
        TabBarComponent,
        MatButtonModule,
        MatIconModule,
        ProfileTopBarComponent,
        ShoppingListCardComponent
    ]
})
export class DisplayHomeComponent implements OnInit, OnDestroy {
  private loadSubscription: Subscription|undefined;

  public currentUserInfo: UserInfo|undefined;
  public shoppingLists: ShoppingList[] = [];

  public constructor(
    private shoppingListService: ShoppingListService,
    private userService: UserService,
    private router: Router
    ) { }

  public ngOnInit(): void {
    this.currentUserInfo = this.userService.getCurrentUserInfo();

    if (this.currentUserInfo?.familyId) {
      this.loadSubscription = this.shoppingListService
      .loadByFamilyId(this.currentUserInfo.familyId, 3)
      .subscribe(shoppingLists => this.shoppingLists = shoppingLists);
    }
  }

  public ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
  }

  public goToDisplayShoppingList(shoppingListId: number|undefined): Promise<boolean>|boolean {
    if (shoppingListId) {
      return this.router.navigate([ShoppingListRoutes.displayShoppingListRoute], { queryParams: { action: 'update', id: shoppingListId } });
    } else {
      return false;
    }
  }

  public goToDisplayShoppingLists(): Promise<boolean> {
    return this.router.navigate([ShoppingListRoutes.displayShoppingListsRoute]);
  }
}