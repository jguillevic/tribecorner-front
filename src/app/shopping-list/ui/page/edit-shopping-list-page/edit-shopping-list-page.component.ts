import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../../service/shopping-list.service';
import { ShoppingList } from '../../../model/shopping-list.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ItemShoppingList } from '../../../model/item-shopping-list.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, combineLatest, debounceTime, exhaustMap, filter, map, mergeMap, of, skip, takeUntil, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Action } from 'src/app/common/action';
import { SimpleLoadingComponent } from "../../../../common/loading/ui/simple-loading/simple-loading.component";
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { GoBackTopBarComponent } from "../../../../common/top-bar/go-back/ui/go-back-top-bar.component";
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ShoppingListCompletedDialogComponent } from '../../component/shopping-list-completed-dialog/shopping-list-completed-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AddItemShoppingListFormComponent } from "../../component/add-item-shopping-list-form/add-item-shopping-list-form.component";

@Component({
    selector: 'app-display-shopping-list-page',
    standalone: true,
    templateUrl: './edit-shopping-list-page.component.html',
    styleUrls: ['edit-shopping-list-page.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        SimpleLoadingComponent,
        MtxButtonModule,
        MatCheckboxModule,
        MatExpansionModule,
        GoBackTopBarComponent,
        MatDividerModule,
        MatDialogModule,
        MatAutocompleteModule,
        AddItemShoppingListFormComponent
    ]
})
export class EditShoppingListComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private currentShoppingListId: number|undefined;
  private isArchived: boolean = false;

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

  // Formulaire.
  public readonly shoppingListNameMaxLength: number = 255;

  private editShoppingListForm: FormGroup = new FormGroup(
    {
      shoppingListName: new FormControl('', [Validators.required, Validators.maxLength(this.shoppingListNameMaxLength)])
    }
  );
  public readonly editShoppingListForm$: Observable<FormGroup> = this.activatedRoute.queryParams
  .pipe(
    mergeMap(params => {
      const currentAction = params['action'];

      if (currentAction === Action.update) {
        this.currentShoppingListId = params['id'];
        if (this.currentShoppingListId) {
          return this.shoppingListService.loadOneById(this.currentShoppingListId);
        }
      }

      const shoppingList: ShoppingList = new ShoppingList();
      return of(shoppingList);
    }),
    tap(shoppingList => this.isArchived = shoppingList.isArchived),
    tap(shoppingList => this.itemShoppingListsSubject.next(shoppingList.items)),
    tap(shoppingList => this.editShoppingListForm.controls['shoppingListName'].setValue(shoppingList.name)),
    map(() => this.editShoppingListForm)
  );

  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly shoppingListService: ShoppingListService,
    private readonly dialog: MatDialog
  ) { }

  public ngOnInit(): void {
    combineLatest(
      { 
        valueChanged: this.editShoppingListForm.valueChanges,
        itemShoppingLists: this.itemShoppingLists$ 
      }
    )
    .pipe(
      skip(1),
      debounceTime(500),
      filter(() => this.editShoppingListForm.valid),
      exhaustMap(() => this.save()),
      takeUntil(this.destroy$),
    )
    .subscribe();

    this.itemShoppingLists$.pipe(
      takeUntil(this.destroy$),
      tap(itemShoppingLists => {
        if (this.editShoppingListForm.valid &&
          !this.isArchived &&
          itemShoppingLists.length > 0 &&
          !itemShoppingLists.filter(itemShoppingList => !itemShoppingList.isChecked).length
        ) {
          this.openShoppingListCompletedDialog();
        }
      })
    )
    .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroy$.complete();
  }

  private getShoppingList(): ShoppingList {
    const shoppingList: ShoppingList = new ShoppingList();

    if (this.currentShoppingListId) {
      shoppingList.id = this.currentShoppingListId;
    }
    shoppingList.isArchived = this.isArchived;
    shoppingList.name = this.editShoppingListForm.controls['shoppingListName'].value;
    shoppingList.items = this.itemShoppingListsSubject.value;

    return shoppingList;
  }

  private save(): Observable<ShoppingList> {
    const shoppingList: ShoppingList = this.getShoppingList();

    if (this.currentShoppingListId !== undefined) {
      return this.shoppingListService.update(shoppingList);
    }

    return this.shoppingListService.create(shoppingList)
    .pipe(
      tap(shoppingList => this.currentShoppingListId = shoppingList.id)
    );
  }

  public itemShoppingListAdded(itemShoppingList: ItemShoppingList): void {
    this.itemShoppingListsSubject.next([...this.itemShoppingListsSubject.value, itemShoppingList]);
    itemShoppingList.position = this.itemShoppingListsSubject.value.indexOf(itemShoppingList) ?? 0 + 1;
  }

  public deleteItemShoppingList(itemShoppingList: ItemShoppingList): void {
      const itemIndex: number = this.itemShoppingListsSubject.value.indexOf(itemShoppingList);
      this.itemShoppingListsSubject.value.splice(itemIndex, 1);
      this.itemShoppingListsSubject.next([...this.itemShoppingListsSubject.value]);
  }

  public toggleItemShoppingList(itemShoppingList: ItemShoppingList) {
    itemShoppingList.isChecked = !itemShoppingList.isChecked;
    this.itemShoppingListsSubject.next([...this.itemShoppingListsSubject.value]);
  }

  private openShoppingListCompletedDialog() {
    const dialogRef = this.dialog.open(ShoppingListCompletedDialogComponent, { data: this.getShoppingList() });

    dialogRef.afterClosed()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe();
  }
}