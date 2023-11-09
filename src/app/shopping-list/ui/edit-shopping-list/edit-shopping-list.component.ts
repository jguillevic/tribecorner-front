import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../service/shopping-list.service';
import { ShoppingList } from '../../model/shopping-list.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ItemShoppingList } from '../../model/item-shopping-list.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, combineLatest, debounceTime, filter, map, mergeMap, of, skip, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Action } from 'src/app/common/action';
import { ShoppingListRoutes } from '../../route/shopping-list.routes';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { GoBackTopBarComponent } from "../../../common/top-bar/go-back/ui/go-back-top-bar.component";
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-display-shopping-list',
    standalone: true,
    templateUrl: './edit-shopping-list.component.html',
    styleUrls: ['edit-shopping-list.component.scss'],
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
        MatDividerModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditShoppingListComponent implements OnInit, OnDestroy {
  private autoSaveSubscription: Subscription|undefined;
  private currentShoppingListId: number|undefined;

  private itemShoppingListsSubject: BehaviorSubject<ItemShoppingList[]> = new BehaviorSubject<ItemShoppingList[]>([]);
  public itemShoppingLists$: Observable<ItemShoppingList[]> = this.itemShoppingListsSubject.asObservable();

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
    tap(shoppingList => this.itemShoppingListsSubject.next(shoppingList.items)),
    tap(shoppingList => this.editShoppingListForm.controls['shoppingListName'].setValue(shoppingList.name)),
    map(() => this.editShoppingListForm)
  );

  public readonly itemShoppingListNameMaxLength: number = 255;

  public readonly addNewItemShoppingListForm: FormGroup = new FormGroup(
    {
      newItemShoppingListName: new FormControl('', [Validators.maxLength(this.itemShoppingListNameMaxLength)])
    }
  );

  public constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private shoppingListService: ShoppingListService
  ) { }

  public ngOnInit(): void {
    this.autoSaveSubscription = 
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
      switchMap(() => this.save())
    )
    .subscribe();
  }

  public ngOnDestroy(): void {
    this.autoSaveSubscription?.unsubscribe();
  }

  private getShoppingList(): ShoppingList {
    const shoppingList: ShoppingList = new ShoppingList();

    if (this.currentShoppingListId) {
      shoppingList.id = this.currentShoppingListId;
    }
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

  public goToDisplayShoppingLists(): Promise<boolean> {
    return this.router.navigate(
      [ShoppingListRoutes.displayShoppingListsRoute]
    );
  }

  public addItemShoppingList(): void {
    if (this.addNewItemShoppingListForm.valid)
    {
      const newItemShoppingListName: string = this.addNewItemShoppingListForm.controls['newItemShoppingListName'].value;

      if (newItemShoppingListName.length) {
        const itemShoppingList: ItemShoppingList  = new ItemShoppingList();
        itemShoppingList.name = newItemShoppingListName;
        this.itemShoppingListsSubject.next([...this.itemShoppingListsSubject.value, itemShoppingList]);
        itemShoppingList.position = this.itemShoppingListsSubject.value.indexOf(itemShoppingList) + 1;
        this.addNewItemShoppingListForm.controls['newItemShoppingListName'].setValue('');
      }
    }
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
}