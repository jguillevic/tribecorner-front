import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabBarComponent } from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';
import { Router } from '@angular/router';
import { ShoppingList } from '../../model/shopping-list.model';
import { BehaviorSubject, Observable, Subscription, combineLatest, map, shareReplay, tap } from 'rxjs';
import { ShoppingListRoutes } from '../../route/shopping-list.routes';
import { ShoppingListService } from '../../service/shopping-list.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingListCardComponent } from "../shopping-list-card/shopping-list-card.component";
import { ProfileTopBarComponent } from 'src/app/common/top-bar/profile/ui/profile-top-bar.component';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { LargeEmptyComponent } from "../../../common/empty/ui/large-empty/large-empty.component";
import { MatTabsModule } from '@angular/material/tabs';
import { ShoppingListCopyButtonComponent } from "../shopping-list-copy-button/shopping-list-copy-button.component";

@Component({
    selector: 'app-display-shopping-lists',
    standalone: true,
    templateUrl: './display-shopping-lists.component.html',
    styleUrls: ['display-shopping-lists.component.scss'],
    imports: [
        CommonModule,
        TabBarComponent,
        MatButtonModule,
        MatIconModule,
        ProfileTopBarComponent,
        ShoppingListCardComponent,
        SimpleLoadingComponent,
        LargeEmptyComponent,
        MatTabsModule,
        ShoppingListCopyButtonComponent
    ]
})
export class DisplayShoppingListsComponent implements OnDestroy {
  private deleteSubscription: Subscription|undefined;

  private addedShoppingListsSubject: BehaviorSubject<ShoppingList[]> = new BehaviorSubject<ShoppingList[]>([]);
  public addedShoppingLists$ = this.addedShoppingListsSubject.asObservable();

  private deletedShoppingListSubject: BehaviorSubject<ShoppingList[]> = new BehaviorSubject<ShoppingList[]>([]);
  public deletedShoppingLists$ = this.deletedShoppingListSubject.asObservable();

  public shoppingLists$: Observable<ShoppingList[]> 
  = combineLatest(
    {
      loaded: this.shoppingListService.loadAll(),
      added: this.addedShoppingLists$,
      deleted: this.deletedShoppingLists$
    }
  )
  .pipe(
    map(result =>
      [...result.loaded, ...result.added]
      .filter(shoppingList => !result.deleted.includes(shoppingList))
    )
  );

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

  public delete(shoppingList: ShoppingList): void {
    if (shoppingList.id) {
      this.deleteSubscription = this.shoppingListService.delete(shoppingList.id)
      .pipe(
        tap(() => 
          this.deletedShoppingListSubject.next([...this.deletedShoppingListSubject.value, shoppingList])
        )
      )
      .subscribe();
    }
  }

  public onShoppingListCopied(copiedShoppingList: ShoppingList) {
    this.addedShoppingListsSubject.next(
      [
        ...this.addedShoppingListsSubject.value,
        copiedShoppingList]
      );
  }

  public toggleArchive(shoppingListId: number|undefined): void {
    if (shoppingListId) {

    }
  }
}