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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarRef, MatSnackBarModule } from '@angular/material/snack-bar';
import { ShoppingListCardComponent } from "../shopping-list-card/shopping-list-card.component";
import { ProfileTopBarComponent } from 'src/app/common/top-bar/profile/ui/profile-top-bar.component';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";

@Component({
    selector: 'app-display-shopping-lists',
    standalone: true,
    templateUrl: './display-shopping-lists.component.html',
    styles: [],
    imports: [
        CommonModule,
        TabBarComponent,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        ProfileTopBarComponent,
        ShoppingListCardComponent,
        SimpleLoadingComponent
    ]
})
export class DisplayShoppingListsComponent implements OnInit, OnDestroy {
  private loadSubscription: Subscription|undefined;
  private deleteSubscription: Subscription|undefined;

  public readonly shoppingLists: ShoppingList[] = [];
  public isLoadingShoppingLists: boolean = true;

  public constructor(
    private router: Router,
    private userService: UserService,
    private shoppingListService: ShoppingListService,
    private snackBar: MatSnackBar
    ) { }

  public ngOnInit(): void {
    const userInfo: UserInfo|undefined = this.userService.getCurrentUserInfo();

    if (userInfo && userInfo.familyId) {
      this.loadSubscription = this.shoppingListService.loadAllByFamilyId(userInfo.familyId)
      .subscribe(shoppingLists => {
        shoppingLists.forEach(shoppingList => {
          this.shoppingLists?.push(shoppingList);
        });
        this.isLoadingShoppingLists = false;
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

  public goToUpdate(shoppingListId: number|undefined): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (shoppingListId) {
        resolve(this.router.navigate([ShoppingListRoutes.editShoppingListRoute], { queryParams: { action: 'update', id: shoppingListId } }));
      } else {
        reject(false);
      }
    }); 
  }

  public goToDisplay(shoppingListId: number|undefined): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (shoppingListId) {
        resolve(this.router.navigate([ShoppingListRoutes.displayShoppingListRoute], { queryParams: { id: shoppingListId } }));
      } else {
        reject(false);
      }
    });
  }

  public delete(shoppingList: ShoppingList): void {
    if (shoppingList.id) {
      this.deleteSubscription = this.shoppingListService.delete(shoppingList.id)
      .pipe(
        switchMap(() => {
          if (this.shoppingLists) {
            const index: number = this.shoppingLists.indexOf(shoppingList);
            this.shoppingLists.splice(index, 1);

            const snackBarRef: MatSnackBarRef<any> = this.snackBar.open('Liste supprimée', 'Annuler', { duration: 5000 });
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

  public setFavorite(shoppingList: ShoppingList|undefined): void {
    if (shoppingList) {
      shoppingList.favorite = !shoppingList.favorite;
    }
  }
}