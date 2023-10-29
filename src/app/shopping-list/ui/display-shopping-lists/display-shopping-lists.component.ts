import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabBarComponent } from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';
import { Router } from '@angular/router';
import { ShoppingList } from '../../model/shopping-list.model';
import { Observable, Subscription, of, tap } from 'rxjs';
import { ShoppingListRoutes } from '../../route/shopping-list.routes';
import { ShoppingListService } from '../../service/shopping-list.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingListCardComponent } from "../shopping-list-card/shopping-list-card.component";
import { ProfileTopBarComponent } from 'src/app/common/top-bar/profile/ui/profile-top-bar.component';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { LargeEmptyComponent } from "../../../common/empty/ui/large-empty/large-empty.component";

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
        ProfileTopBarComponent,
        ShoppingListCardComponent,
        SimpleLoadingComponent,
        LargeEmptyComponent
    ]
})
export class DisplayShoppingListsComponent implements OnDestroy {
  private deleteSubscription: Subscription|undefined;

  public shoppingLists$: Observable<ShoppingList[]> 
  = this.shoppingListService
  .loadAll();

  public constructor(
    private router: Router,
    private shoppingListService: ShoppingListService
  ) { }

  public ngOnDestroy(): void {
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
        tap(() => 
          this.shoppingLists$ 
          = this.shoppingListService
          .loadAll()
        )
      )
      .subscribe();
    }
  }

  public setFavorite(shoppingList: ShoppingList|undefined): void {
    if (shoppingList) {
      shoppingList.favorite = !shoppingList.favorite;
    }
  }
}