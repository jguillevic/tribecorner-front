import {Component, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShoppingListApiService} from '../../../service/shopping-list-api.service';
import {ShoppingList} from '../../../model/shopping-list.model';
import {ItemShoppingList} from '../../../model/item-shopping-list.model';
import {BehaviorSubject, Observable, Subject, map, mergeMap, of, takeUntil, tap} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {SimpleLoadingComponent} from "../../../../common/loading/ui/simple-loading/simple-loading.component";
import {MatExpansionModule} from '@angular/material/expansion';
import {GoBackTopBarComponent} from "../../../../common/top-bar/go-back/ui/go-back-top-bar.component";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ShoppingListCompletedDialogComponent} from '../../component/shopping-list-completed-dialog/shopping-list-completed-dialog.component';
import {AddItemShoppingListFormComponent} from "../../component/add-item-shopping-list-form/add-item-shopping-list-form.component";
import {ItemShoppingListApiService} from 'src/app/shopping-list/service/item-shopping-list-api.service';
import {CheckableItemShoppingListsComponent} from "../../component/checkable-item-shopping-lists/checkable-item-shopping-lists.component";
import {EditShoppingListFormComponent} from "../../component/edit-shopping-list-form/edit-shopping-list-form.component";
import {TranslocoModule, provideTranslocoScope} from '@ngneat/transloco';

@Component({
    selector: 'app-display-shopping-list-page',
    standalone: true,
    templateUrl: './edit-shopping-list-page.component.html',
    styleUrls: ['edit-shopping-list-page.component.scss'],
    imports: [
        CommonModule,
        SimpleLoadingComponent,
        MatExpansionModule,
        GoBackTopBarComponent,
        MatDialogModule,
        AddItemShoppingListFormComponent,
        CheckableItemShoppingListsComponent,
        EditShoppingListFormComponent,
        TranslocoModule
    ],providers: [
      provideTranslocoScope({
          scope: 'shopping-list/ui/page/edit-shopping-list-page',
          alias: 'editShoppingListPage'
      })
  ],
})
export class EditShoppingListComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private shoppingListValidity: boolean = false;
  public currentShoppingListId: number|undefined;

  private readonly itemShoppingListsSubject: BehaviorSubject<ItemShoppingList[]> = new BehaviorSubject<ItemShoppingList[]>([]);
  public readonly itemShoppingLists$: Observable<ItemShoppingList[]> = this.itemShoppingListsSubject.asObservable();

  public notCheckedItemShoppingLists$ = this.itemShoppingLists$
  .pipe(
    map(
      itemShoppingLists => 
        itemShoppingLists.filter(itemShoppingList => !itemShoppingList.isChecked)
    )
  );

  public checkedItemShoppingLists$ = this.itemShoppingLists$
  .pipe(
    map(
      itemShoppingLists => 
        itemShoppingLists.filter(itemShoppingList => itemShoppingList.isChecked)
    )
  );

  private shoppingList: ShoppingList|undefined;
  public readonly shoppingList$: Observable<ShoppingList> = this.activatedRoute.queryParams
  .pipe(
    mergeMap(params => {
      if (params['id']) {
        this.currentShoppingListId = parseInt(params['id']);
        return this.shoppingListApiService.loadOneById(this.currentShoppingListId);
      }

      const shoppingList: ShoppingList = new ShoppingList();
      return of(shoppingList);
    }),
    tap(shoppingList => 
      {
        this.shoppingList = shoppingList;
        this.nextItemShoppingList(shoppingList.items);
      }
    ),
  );

  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly shoppingListApiService: ShoppingListApiService,
    private readonly itemShoppingListApiService: ItemShoppingListApiService,
    private readonly dialog: MatDialog
  ) { }

  public ngOnDestroy(): void {
    this.destroy$.complete();
  }

  private nextItemShoppingList(itemShoppingLists: ItemShoppingList[]) {
    this.itemShoppingListsSubject.next(itemShoppingLists);
  }

  private save(shoppingList: ShoppingList): Observable<ShoppingList> {
     if (this.currentShoppingListId !== undefined) {
      return this.shoppingListApiService.update(shoppingList);
    }

    return this.shoppingListApiService.create(shoppingList)
    .pipe(
      tap(shoppingList => this.currentShoppingListId = shoppingList.id)
    );
  }

  public editShoppingList(shoppingList: ShoppingList): void {
    shoppingList.items = this.itemShoppingListsSubject.value;
    this.save(shoppingList)
    .pipe(
      tap((shoppingList: ShoppingList) => this.shoppingList = shoppingList),
      takeUntil(this.destroy$)
    )
    .subscribe();
  }

  public changeShoppingListValidity(isValid: boolean): void {
    this.shoppingListValidity = isValid;
  }

  public addItemShoppingList(itemShoppingList: ItemShoppingList): void {
    this.nextItemShoppingList([...this.itemShoppingListsSubject.value, itemShoppingList]);
    itemShoppingList.position = this.itemShoppingListsSubject.value.indexOf(itemShoppingList) ?? 0 + 1;

    this.itemShoppingListApiService.create(itemShoppingList)
    .pipe(
      tap(loadedItemShoppingList => itemShoppingList.id = loadedItemShoppingList.id),
      takeUntil(this.destroy$)
    )
    .subscribe();
  }

  public deleteItemShoppingList(itemShoppingList: ItemShoppingList): void {
      const itemIndex: number = this.itemShoppingListsSubject.value.indexOf(itemShoppingList);
      this.itemShoppingListsSubject.value.splice(itemIndex, 1);
      this.nextItemShoppingList([...this.itemShoppingListsSubject.value]);

      if (itemShoppingList.id) {
        this.itemShoppingListApiService.delete(itemShoppingList.id)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe();
      }
  }

  public toggleItemShoppingList(itemShoppingList: ItemShoppingList) {
    this.nextItemShoppingList([...this.itemShoppingListsSubject.value]);

    this.itemShoppingListApiService.upate(itemShoppingList)
    .pipe(
      tap(() => this.askIfShoppingListNeedToBeArchived()),
      takeUntil(this.destroy$)
    )
    .subscribe();
  }

  private openShoppingListCompletedDialog() {
    const dialogRef = this.dialog.open(ShoppingListCompletedDialogComponent, { data: this.shoppingList });

    dialogRef.afterClosed()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe();
  }

  private askIfShoppingListNeedToBeArchived(): void {
    if (this.shoppingList &&
      this.shoppingListValidity &&
      !this.shoppingList.isArchived &&
      this.itemShoppingListsSubject.value.length > 0 &&
      !this.itemShoppingListsSubject.value.filter(itemShoppingList => !itemShoppingList.isChecked).length
    ) {
      this.openShoppingListCompletedDialog();
    }
  }
}