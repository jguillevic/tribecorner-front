import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../service/shopping-list.service';
import { ShoppingList } from '../../model/shopping-list.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ItemShoppingList } from '../../model/item-shopping-list.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, map, mergeMap, of, share, shareReplay, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Action } from 'src/app/common/action';
import { ShoppingListRoutes } from '../../route/shopping-list.routes';
import { EditTopBarComponent } from "../../../common/top-bar/edit/ui/edit-top-bar/edit-top-bar.component";
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-display-shopping-list',
    standalone: true,
    templateUrl: './edit-shopping-list.component.html',
    styleUrls: [ 'edit-shopping-list.component.scss' ],
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        EditTopBarComponent,
        ReactiveFormsModule,
        SimpleLoadingComponent,
        MtxButtonModule,
        MatCheckboxModule,
        MatExpansionModule
    ]
})
export class EditShoppingListComponent implements OnDestroy {
  private saveSubscription: Subscription|undefined;
  private currentShoppingListId: number|undefined;

  public currentAction$ = this.activatedRoute.queryParams
  .pipe(
    map(params => params['action'] as string),
    shareReplay(1)
  );

  public isCreating$ = this.currentAction$
  .pipe(
    map(currentAction => {
      if (currentAction === Action.create) {
        return true;
      }
      return false;
    }),
    shareReplay(1)
  );

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

  private readonly isSavingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isSaving$: Observable<boolean> = this.isSavingSubject.asObservable();

  private readonly isClosingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isClosing$: Observable<boolean> = this.isClosingSubject.asObservable();

  // Formulaire.
  public readonly shoppingListNameMaxLength: number = 255;
  private editShoppingListForm: FormGroup|undefined;
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
    map(shoppingList => 
      new FormGroup(
        {
          shoppingListName: new FormControl(shoppingList.name, [Validators.required, Validators.maxLength(this.shoppingListNameMaxLength)]),
          newItemShoppingListName: new FormControl('')
        }
      )
    ),
    tap(editShoppingListForm => this.editShoppingListForm = editShoppingListForm)
  );

  public readonly addNewItemShoppingListForm: FormGroup = new FormGroup(
    {
      newItemShoppingListName: new FormControl('')
    }
  )
  
  public constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private shoppingListService: ShoppingListService
  ) { }

  public ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  private getShoppingList(): ShoppingList {
    const shoppingList: ShoppingList = new ShoppingList();

    if (this.currentShoppingListId) {
      shoppingList.id = this.currentShoppingListId;
    }
    shoppingList.name = this.editShoppingListForm?.controls['shoppingListName'].value;
    shoppingList.items = this.itemShoppingListsSubject.value;

    return shoppingList;
  }

  private save(): Observable<ShoppingList> {
    return this.currentAction$
    .pipe(
      mergeMap(currentAction => {
        const shoppingList: ShoppingList = this.getShoppingList();

        if (currentAction === Action.update) {
          return this.shoppingListService.update(shoppingList);
        } 
        return this.shoppingListService.create(shoppingList);
      })
    );
  }

  private handleError(error: any): void {
    this.isSavingSubject.next(false);
    window.alert("Problème technique. Veuillez réessayer dans quelques minutes.");
  }

  public goToDisplayShoppingLists(): Promise<boolean> {
    return this.router.navigate(
      [ShoppingListRoutes.displayShoppingListsRoute]
    );
  }

  public editShoppingList(): void {
        // Pour forcer l'apparition des erreurs.
        this.editShoppingListForm?.markAllAsTouched();
    if (this.editShoppingListForm?.valid) {
      this.isSavingSubject.next(true);
      this.saveSubscription 
      = this.save()
      .subscribe({
        next: () => this.goToDisplayShoppingLists(),
        error: (error) => this.handleError(error)
      });
    }
  }

  public addItemShoppingList(): void {
    const newItemShoppingListName: string = this.addNewItemShoppingListForm?.controls['newItemShoppingListName'].value;

    if (newItemShoppingListName.length) {
      const itemShoppingList: ItemShoppingList  = new ItemShoppingList();
      itemShoppingList.name = newItemShoppingListName;
      this.itemShoppingListsSubject.next([...this.itemShoppingListsSubject.value, itemShoppingList]);
      itemShoppingList.position = this.itemShoppingListsSubject.value.indexOf(itemShoppingList) + 1;
      this.addNewItemShoppingListForm?.controls['newItemShoppingListName'].setValue("");
    }
  }

  public deleteItemShoppingList(itemShoppingList: ItemShoppingList): void {
      const itemIndex: number = this.itemShoppingListsSubject.value.indexOf(itemShoppingList);
      this.itemShoppingListsSubject.value.splice(itemIndex, 1);
      this.itemShoppingListsSubject.next([...this.itemShoppingListsSubject.value]);
  }

  public close(): Promise<boolean> {
    this.isClosingSubject.next(true);
    return this.goToDisplayShoppingLists();
  }

  public toggleItemShoppingList(itemShoppingList: ItemShoppingList) {
    itemShoppingList.isChecked = !itemShoppingList.isChecked;
    this.itemShoppingListsSubject.next([...this.itemShoppingListsSubject.value]);
  }
}