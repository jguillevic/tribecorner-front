import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../../service/shopping-list.service';
import { ShoppingList } from '../../../model/shopping-list.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ItemShoppingList } from '../../../model/item-shopping-list.model';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, combineLatest, debounceTime, exhaustMap, filter, map, mergeMap, of, takeUntil, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
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
import { ItemShoppingListGoToService } from 'src/app/shopping-list/service/item-shopping-list-go-to.service';
import { ItemShoppingListApiService } from 'src/app/shopping-list/service/item-shopping-list-api.service';

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
  public currentShoppingListId: number|undefined;
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
      if (params['id']) {
        this.currentShoppingListId = parseInt(params['id']);
        return this.shoppingListService.loadOneById(this.currentShoppingListId);
      }

      const shoppingList: ShoppingList = new ShoppingList();
      return of(shoppingList);
    }),
    tap(shoppingList => this.isArchived = shoppingList.isArchived),
    tap(shoppingList => this.nextItemShoppingList(shoppingList.items)),
    tap(shoppingList => this.updateEditShoppingListForm(shoppingList)),
    map(() => this.editShoppingListForm)
  );

  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly shoppingListService: ShoppingListService,
    private readonly itemShoppingListApiService: ItemShoppingListApiService,
    private readonly itemShoppingListGoToService: ItemShoppingListGoToService,
    private readonly dialog: MatDialog
  ) { }

  public ngOnInit(): void {
    this.saveOnFormUpdate();
  }

  public ngOnDestroy(): void {
    this.destroy$.complete();
  }

  public trackByItemShoppingList(index: number, itemShoppingList: ItemShoppingList): string {
    return itemShoppingList.name;
  }

  private nextItemShoppingList(itemShoppingLists: ItemShoppingList[]) {
    this.itemShoppingListsSubject.next(itemShoppingLists);
  }

  private getNameControl(): AbstractControl<any, any> {
    return this.editShoppingListForm.controls['shoppingListName'];
  }

  private getNameControlValue(): string {
    return this.getNameControl().value;
  }

  private updateNameControl(name: string): void {
    this.getNameControl().setValue(name);
  }

  private updateEditShoppingListForm(shoppingList: ShoppingList) {
    this.updateNameControl(shoppingList.name);
  }

  private getShoppingList(): ShoppingList {
    const shoppingList: ShoppingList = new ShoppingList();

    if (this.currentShoppingListId) {
      shoppingList.id = this.currentShoppingListId;
    }
    shoppingList.isArchived = this.isArchived;
    shoppingList.name = this.getNameControlValue();
    shoppingList.items = this.itemShoppingListsSubject.value;

    return shoppingList;
  }

  public goToItemShoppingListUpdate(itemShoppingListId: number|undefined): Observable<boolean> {
    return this.itemShoppingListGoToService.goToUpdate(itemShoppingListId);
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

  private saveOnFormUpdate(): void {
    this.editShoppingListForm.valueChanges
    .pipe(
      debounceTime(500),
      filter(() => this.editShoppingListForm.valid),
      exhaustMap(() => this.save()),
      takeUntil(this.destroy$),
    )
    .subscribe();
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
    itemShoppingList.isChecked = !itemShoppingList.isChecked;
    this.nextItemShoppingList([...this.itemShoppingListsSubject.value]);

    this.itemShoppingListApiService.upate(itemShoppingList)
    .pipe(
      tap(() => this.askIfShoppingListNeedToBeArchived()),
      takeUntil(this.destroy$)
    )
    .subscribe();
  }

  private openShoppingListCompletedDialog() {
    const dialogRef = this.dialog.open(ShoppingListCompletedDialogComponent, { data: this.getShoppingList() });

    dialogRef.afterClosed()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe();
  }

  private askIfShoppingListNeedToBeArchived(): void {
    if (this.editShoppingListForm.valid &&
      !this.isArchived &&
      this.itemShoppingListsSubject.value.length > 0 &&
      !this.itemShoppingListsSubject.value.filter(itemShoppingList => !itemShoppingList.isChecked).length
    ) {
      this.openShoppingListCompletedDialog();
    }
  }
}