import {Component, OnDestroy, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabBarComponent} from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';
import {ShoppingList} from '../../../model/shopping-list.model';
import {BehaviorSubject, Observable, Subscription, combineLatest, map, shareReplay} from 'rxjs';
import {ShoppingListApiService} from '../../../service/shopping-list-api.service';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ShoppingListCardComponent} from "../../component/shopping-list-card/shopping-list-card.component";
import {ProfileTopBarComponent} from 'src/app/common/top-bar/profile/ui/profile-top-bar.component';
import {SimpleLoadingComponent} from "../../../../common/loading/ui/simple-loading/simple-loading.component";
import {LargeEmptyComponent} from "../../../../common/empty/ui/large-empty/large-empty.component";
import {MatTabsModule} from '@angular/material/tabs';
import {ShoppingListGoToService} from 'src/app/shopping-list/service/shopping-list-go-to.service';
import {ShoppingListLoadingCardComponent} from "../../../../shopping-list/ui/component/shopping-list-loading-card/shopping-list-loading-card.component";
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-display-shopping-lists-page',
    standalone: true,
    templateUrl: './display-shopping-lists-page.component.html',
    styleUrls: ['display-shopping-lists-page.component.scss'],
    imports: [
        CommonModule,
        TabBarComponent,
        MatButtonModule,
        MatIconModule,
        ProfileTopBarComponent,
        ShoppingListCardComponent,
        ShoppingListLoadingCardComponent,
        SimpleLoadingComponent,
        LargeEmptyComponent,
        MatTabsModule
    ]
})
export class DisplayShoppingListsComponent implements OnDestroy {
  private deleteSubscription: Subscription|undefined;

  private loadedShoppingLists$ 
  = this.shoppingListApiService.loadAll()
  .pipe(
    shareReplay(1)
  );

  private deletedShoppingListSubject: BehaviorSubject<ShoppingList[]> = new BehaviorSubject<ShoppingList[]>([]);
  public deletedShoppingLists$ = this.deletedShoppingListSubject.asObservable();

  private shoppingLists$: Observable<ShoppingList[]> 
  = combineLatest(
    {
      loaded: this.loadedShoppingLists$,
      deleted: this.deletedShoppingLists$
    }
  )
  .pipe(
    map(result =>
      [...result.loaded]
      .filter(shoppingList => !result.deleted.includes(shoppingList))
    )
  );

  private shoppingListToggleArchiveSubject: BehaviorSubject<ShoppingList> = new BehaviorSubject<ShoppingList>(new ShoppingList());
  private shoppingListToggleArchive$ = this.shoppingListToggleArchiveSubject.asObservable();

  private readonly archivedShoppingLists$: Observable<ShoppingList[]>
  = combineLatest(
    {
      shoppingLists: this.shoppingLists$,
      shoppingListToggleArchive: this.shoppingListToggleArchive$
    }
  )
  .pipe(
    map(result => result.shoppingLists.filter(shoppingList => shoppingList.isArchived))
  );
  public readonly archivedShoppingLists: Signal<ShoppingList[]|undefined> 
  = toSignal(this.archivedShoppingLists$);

  private readonly unarchivedShoppingLists$: Observable<ShoppingList[]>
  = combineLatest(
    {
      shoppingLists: this.shoppingLists$,
      shoppingListToggleArchive: this.shoppingListToggleArchive$
    }
  )
  .pipe(
    map(result => result.shoppingLists.filter(shoppingList => !shoppingList.isArchived))
  );
  public readonly unarchivedShoppingLists: Signal<ShoppingList[]|undefined>
  = toSignal(this.unarchivedShoppingLists$);

  public constructor(
    private readonly shoppingListApiService: ShoppingListApiService,
    private readonly shoppingListGoToService: ShoppingListGoToService
  ) { }

  public ngOnDestroy(): void {
    this.deleteSubscription?.unsubscribe();
  }

  public goToCreate(): Observable<boolean> {
    return this.shoppingListGoToService.goToCreate();
  }

  public shoppingListCopied(copiedShoppingList: ShoppingList): Observable<boolean> {
    return this.shoppingListGoToService.goToUpdate(copiedShoppingList.id);
  }

  public shoppingListDeleted(deletedShoppingList: ShoppingList): void {
    this.deletedShoppingListSubject.next(
      [
        ...this.deletedShoppingListSubject.value,
        deletedShoppingList
      ]
    );
  }

  public shoppingListArchiveToggled(shoppingList: ShoppingList): void {
    this.shoppingListToggleArchiveSubject.next(shoppingList);
  }
}