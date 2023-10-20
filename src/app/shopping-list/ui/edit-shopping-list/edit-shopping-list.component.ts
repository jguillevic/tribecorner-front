import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../service/shopping-list.service';
import { ShoppingList } from '../../model/shopping-list.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ItemShoppingList } from '../../model/item-shopping-list.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription, of, switchMap } from 'rxjs';
import { TabBarComponent } from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { UserService } from 'src/app/user/service/user.service';
import { ShoppingListTopBarComponent } from "../shopping-list-top-bar/shopping-list-top-bar.component";
import { Action } from 'src/app/common/action';
import { ButtonWithSpinnerDirective } from 'src/app/common/button/directive/button-with-spinner.directive';
import { ShoppingListRoutes } from '../../route/shopping-list.routes';
import { EditTopBarComponent } from "../../../common/top-bar/edit/ui/edit-top-bar/edit-top-bar.component";

@Component({
    selector: 'app-display-shopping-list',
    standalone: true,
    templateUrl: './edit-shopping-list.component.html',
    styles: [],
    imports: [
        CommonModule,
        FormsModule,
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        TabBarComponent,
        ShoppingListTopBarComponent,
        ButtonWithSpinnerDirective,
        EditTopBarComponent,
        ReactiveFormsModule
    ]
})
export class EditShoppingListComponent implements OnInit, OnDestroy {
  private _currentAction: Action = Action.create;
  private _currentShoppingListId: number|undefined;
  private _currentFamilyId: number|undefined;
  private _initShoppingListSubscription: Subscription|undefined;

  private _itemShoppingLists: ItemShoppingList[] = [];
  public get itemShoppingLists(): ItemShoppingList[] {
    return this._itemShoppingLists;
  }
  public set itemShoppingLists(value: ItemShoppingList[]) {
    this._itemShoppingLists = value;
  }

  private _isSaving: boolean = false;
  public get isSaving(): boolean {
    return this._isSaving;
  }
  public set isSaving(value: boolean) {
    this._isSaving = value;
  }

  // Formulaire.
  private readonly _shoppingListNameLength: number = 255; 
  public get shoppingListNameMaxLength(): number {
    return this._shoppingListNameLength;
  }

  private readonly _editShoppingListMealForm: FormGroup = new FormGroup(
    {
      shoppingListName: new FormControl(undefined, [Validators.required, Validators.maxLength(this.shoppingListNameMaxLength)]),
      newItemShoppingListName: new FormControl(undefined)
    }
  );
  public get editShoppingListForm(): FormGroup {
    return this._editShoppingListMealForm;
  }
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private shoppingListService: ShoppingListService
    ) { }

  public ngOnInit(): void {
    this._initShoppingListSubscription = this.activatedRoute.queryParams
    .pipe(
      switchMap((params: Params) => {
        this._currentAction = params['action'];

        if (this._currentAction == Action.create) {
          const shoppingList: ShoppingList = new ShoppingList();
          const currentUserInfo: UserInfo|undefined = this.userService.getCurrentUserInfo();
          if (currentUserInfo?.familyId) {
            shoppingList.familyId = currentUserInfo?.familyId;
          }
          return of(shoppingList);
        } else if (this._currentAction == Action.update) {
          this._currentShoppingListId = params['id'];
          if (this._currentShoppingListId) {
            return this.shoppingListService.loadOneById(this._currentShoppingListId);
          }
        }
        return of(undefined);
      })
    )
    .subscribe(shoppingList => {
      if (shoppingList) {
        this.editShoppingListForm.controls['shoppingListName'].setValue(shoppingList.name);
        this.itemShoppingLists = shoppingList.items;
        this._currentFamilyId = shoppingList.familyId;
      }
    });
  }

  public ngOnDestroy(): void {
    this._initShoppingListSubscription?.unsubscribe();
  }

  private getShoppingList(): ShoppingList {
    const shoppingList: ShoppingList = new ShoppingList();

    if (this._currentShoppingListId) {
      shoppingList.id = this._currentShoppingListId;
    }
    if (this._currentFamilyId) {
      shoppingList.familyId = this._currentFamilyId;
    }
    shoppingList.name = this.editShoppingListForm.controls['shoppingListName'].value;
    shoppingList.items = this.itemShoppingLists;

    return shoppingList;
  }

  private save(): Observable<ShoppingList|undefined> {
    const shoppingList: ShoppingList = this.getShoppingList();

    if (this._currentAction == Action.update) {
      return this.shoppingListService.update(shoppingList);
    } else if (this._currentAction == Action.create) {
      return this.shoppingListService.create(shoppingList);
    }

    return of(undefined);
  }

  private handleError(error: any): void {
    this.isSaving = false;
    window.alert("Problème technique. Veuillez réessayer dans quelques minutes.");
  }

  public goToDisplayShoppingLists(): Promise<boolean> {
    return this.router.navigate(
      [ShoppingListRoutes.displayShoppingListsRoute]
    );
  }

  public editShoppingList(): void {
    if (this.editShoppingListForm.valid) {
      this.isSaving = true;
      this.save().subscribe({ 
        next: () => this.goToDisplayShoppingLists(),
        error: (error) => this.handleError(error)
      });
    }
  }

  public addItem(): void {
    const newItemShoppingListName: string = this.editShoppingListForm.controls['newItemShoppingListName'].value;

    if (newItemShoppingListName.length > 0) {
      const itemShoppingList: ItemShoppingList  = new ItemShoppingList();
      itemShoppingList.name = newItemShoppingListName;
      this.itemShoppingLists.push(itemShoppingList);
      itemShoppingList.position = this.itemShoppingLists.indexOf(itemShoppingList) + 1;
      this.editShoppingListForm.controls['newItemShoppingListName'].setValue("");
    }
  }

  public deleteItem(itemShoppingList: ItemShoppingList): void {
      const itemIndex: number = this.itemShoppingLists.indexOf(itemShoppingList);
      this.itemShoppingLists.splice(itemIndex, 1);
  }

  public isCreating(): boolean {
    return this._currentAction == Action.create;
  }
}