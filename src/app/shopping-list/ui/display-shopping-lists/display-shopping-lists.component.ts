import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabBarComponent } from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';
import { Router } from '@angular/router';
import { ShoppingList } from '../../model/shopping-list.model';
import { Subscription, of, switchMap } from 'rxjs';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { UserService } from 'src/app/user/service/user.service';
import { ShoppingListRoutes } from '../../route/shopping-list.routes';
import { ShoppingListService } from '../../service/shopping-list.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSnackBar, MatSnackBarRef, MatSnackBarModule} from '@angular/material/snack-bar';
import { ProfileTopBarComponent } from "../../../common/profile-top-bar/ui/profile-top-bar/profile-top-bar.component";

@Component({
    selector: 'app-display-shopping-lists',
    standalone: true,
    templateUrl: './display-shopping-lists.component.html',
    styles: [],
    imports: [
        CommonModule,
        TabBarComponent,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        ProfileTopBarComponent
    ]
})
export class DisplayShoppingListsComponent implements OnInit, OnDestroy {
  private loadSubscription: Subscription|undefined;
  private deleteSubscription: Subscription|undefined;

  public shoppingLists: ShoppingList[]|undefined;

  public constructor(
    private router: Router,
    private userService: UserService,
    private shoppingListService: ShoppingListService,
    private snackBar: MatSnackBar
    ) { }

  public ngOnInit(): void {
    const userInfo: UserInfo|undefined = this.userService.getCurrentUserInfo();

    if (userInfo && userInfo.familyId) {
      this.loadSubscription = this.shoppingListService.loadByFamilyId(userInfo.familyId)
      .subscribe(shoppingLists => {
        this.shoppingLists = shoppingLists;
      });
    }
  }

  public ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
  }

  public goToCreate(): Promise<boolean> {
    return this.router.navigate([ShoppingListRoutes.editShoppingListRoute], { queryParams: { action: 'create' } });
  }

  public goToUpdate(shoppingListId: number|undefined): Promise<boolean>|undefined {
    if (shoppingListId) {
      return this.router.navigate([ShoppingListRoutes.editShoppingListRoute], { queryParams: { action: 'update', id: shoppingListId } });
    }
    return undefined;
  }

  public goToDisplay(shoppingListId: number|undefined): Promise<boolean>|undefined {
    if (shoppingListId) {
      return this.router.navigate([ShoppingListRoutes.displayShoppingListRoute], { queryParams: { id: shoppingListId } });
    }
    return undefined;
  }

  public delete(shoppingList: ShoppingList): void {
    if (shoppingList.id) {
      this.deleteSubscription = this.shoppingListService.delete(shoppingList.id)
      .pipe(
        switchMap(() => {
          if (this.shoppingLists) {
            const index: number = this.shoppingLists.indexOf(shoppingList);
            this.shoppingLists.splice(index, 1);

            const snackBarRef = this.snackBar.open('Liste supprimée', 'Annuler', { duration: 5000 });
            return snackBarRef.onAction()
            .pipe(
              switchMap(() => {
                shoppingList.id = undefined;
                return this.shoppingListService.create(shoppingList)
                .pipe(
                  switchMap((createdShoppingList) => {
                    if (createdShoppingList) {
                      this.shoppingLists?.splice(index, 0, createdShoppingList);
                      return of(true);
                    }
                    return of(false);
                  })
                );
              })
            );
          }
          return of(false);
        })
      ).subscribe();
    }
  }
}
