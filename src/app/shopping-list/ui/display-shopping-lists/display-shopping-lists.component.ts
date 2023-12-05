import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabBarComponent } from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';
import { Router } from '@angular/router';
import { ShoppingList } from '../../model/shopping-list.model';
import { BehaviorSubject, Observable, Subscription, combineLatest, map, shareReplay } from 'rxjs';
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
import { ShoppingListDeleteButtonComponent } from "../shopping-list-delete-button/shopping-list-delete-button.component";
import { ShoppingListArchiveToggleComponent } from "../shopping-list-archive-toggle/shopping-list-archive-toggle.component";

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
        ShoppingListCopyButtonComponent,
        ShoppingListDeleteButtonComponent,
        ShoppingListArchiveToggleComponent
    ]
})
export class DisplayShoppingListsComponent implements OnDestroy {
  private deleteSubscription: Subscription|undefined;

  private loadedShoppingLists$ 
  = this.shoppingListService.loadAll()
  .pipe(
    shareReplay(1)
  );

  private addedShoppingListsSubject: BehaviorSubject<ShoppingList[]> = new BehaviorSubject<ShoppingList[]>([]);
  public addedShoppingLists$ = this.addedShoppingListsSubject.asObservable();

  private deletedShoppingListSubject: BehaviorSubject<ShoppingList[]> = new BehaviorSubject<ShoppingList[]>([]);
  public deletedShoppingLists$ = this.deletedShoppingListSubject.asObservable();

  private shoppingLists$: Observable<ShoppingList[]> 
  = combineLatest(
    {
      loaded: this.loadedShoppingLists$,
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

  private shoppingListToggleArchiveSubject: BehaviorSubject<ShoppingList> = new BehaviorSubject<ShoppingList>(new ShoppingList());
  private shoppingListToggleArchive$ = this.shoppingListToggleArchiveSubject.asObservable();

  public archivedShoppingLists$: Observable<ShoppingList[]>
  = combineLatest(
    {
      shoppingLists: this.shoppingLists$,
      shoppingListToggleArchive: this.shoppingListToggleArchive$
    }
  )
  .pipe(
    map(result => result.shoppingLists.filter(shoppingList => shoppingList.isArchived))
  );

  public unarchivedShoppingLists$: Observable<ShoppingList[]>
  = combineLatest(
    {
      shoppingLists: this.shoppingLists$,
      shoppingListToggleArchive: this.shoppingListToggleArchive$
    }
  )
  .pipe(
    map(result => result.shoppingLists.filter(shoppingList => !shoppingList.isArchived))
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

  public onShoppingListCopied(copiedShoppingList: ShoppingList) {
    this.addedShoppingListsSubject.next(
      [
        ...this.addedShoppingListsSubject.value,
        copiedShoppingList]
      );
  }

  public onShoppingListDeleted(deletedShoppingList: ShoppingList) {
    this.deletedShoppingListSubject.next(
      [
        ...this.deletedShoppingListSubject.value,
        deletedShoppingList
      ]
    );
  }

  public onShoppingListArchiveToggled(shoppingList: ShoppingList): void {
    this.shoppingListToggleArchiveSubject.next(shoppingList);
  }
}