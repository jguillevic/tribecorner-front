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
import { FormsModule } from '@angular/forms';
import { Subscription, interval, map, of, switchMap } from 'rxjs';
import { TabBarComponent } from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { UserService } from 'src/app/user/service/user.service';
import { ShoppingListTopBarComponent } from "../shopping-list-top-bar/shopping-list-top-bar.component";
import { ShoppingListRoutes } from '../../route/shopping-list.routes';

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
        ShoppingListTopBarComponent
    ]
})
export class EditShoppingListComponent implements OnInit, OnDestroy {
  private static createAction: string = 'create';
  private static updateAction: string = 'update';
  private currentAction: string|undefined;
  private isEditing: boolean = false;
  private isSaving: boolean = false;
  private initShoppingListSubscription: Subscription|undefined;
  private timerSubscription: Subscription|undefined;
  private deleteSubscription: Subscription|undefined;
  private editSubscriptions: Subscription[] = [];

  public newItemShopListName: string = '';
  public shoppingList: ShoppingList|undefined;
  public boundedDelete: (() => Promise<boolean>|undefined)|undefined;
  public boundedGoToDisplay: (() => Promise<boolean>|undefined)|undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private shoppingListService: ShoppingListService
    ) { }

  public ngOnInit(): void {
    this.initShoppingListSubscription = this.activatedRoute.queryParams
    .pipe(
      switchMap((params: Params) => {
        this.currentAction = params['action'];

        if (this.currentAction == EditShoppingListComponent.createAction) {
          const shoppingList: ShoppingList = new ShoppingList();
          shoppingList.name = 'Ma liste';
          const currentUserInfo: UserInfo|undefined = this.userService.getCurrentUserInfo();
          if (currentUserInfo?.familyId) {
            shoppingList.familyId = currentUserInfo?.familyId;
          }
          return of(shoppingList);
        } else if (this.currentAction == EditShoppingListComponent.updateAction) {
          this.boundedDelete = this.delete.bind(this);
          this.boundedGoToDisplay = this.goToDisplay.bind(this);

          const shoppingListId: number = params['id'];
          return this.shoppingListService.loadOneById(shoppingListId);
        }
        return of(undefined);
      })
    )
    .subscribe(shoppingList => {
      this.shoppingList = shoppingList;
    });
    this.timerSubscription = interval(1000).subscribe(() => this.save());
  }

  public ngOnDestroy(): void {
    this.initShoppingListSubscription?.unsubscribe();
    this.timerSubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
    this.editSubscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public addItem(): void {
    if (this.shoppingList &&
      this.newItemShopListName.length) {
      const itemShoppingList: ItemShoppingList  = new ItemShoppingList();
      itemShoppingList.name = this.newItemShopListName;
      this.shoppingList.items.push(itemShoppingList);
      itemShoppingList.position = this.shoppingList.items.indexOf(itemShoppingList) + 1;
      this.newItemShopListName = '';

      this.isEditing = true;
    }
  }

  public deleteItem(itemShoppingList: ItemShoppingList): void {
    if (this.shoppingList) {
      const itemIndex: number = this.shoppingList.items.indexOf(itemShoppingList);
      this.shoppingList.items.splice(itemIndex, 1);

      this.isEditing = true;
    }
  }

  public checkItem(itemShoppingList: ItemShoppingList): void {
    itemShoppingList.isChecked = !itemShoppingList.isChecked;

    this.isEditing = true;
  }

  public save(): void {
    if (
      this.shoppingList &&
      this.isEditing &&
      !this.isSaving
      ) {
      this.isSaving = true;

      if (this.currentAction == EditShoppingListComponent.updateAction) {
        this.editSubscriptions.push(
          this.shoppingListService.update(this.shoppingList).subscribe(() => { 
            this.isEditing = false;
            this.isSaving = false; 
          })
        );
      } else if (this.currentAction == EditShoppingListComponent.createAction) {
        this.editSubscriptions.push(
          this.shoppingListService.create(this.shoppingList).subscribe((shoppingList) => {
            this.isEditing = false;
            this.isSaving = false;
            this.currentAction = EditShoppingListComponent.updateAction;
            if (this.shoppingList && shoppingList) {
              this.shoppingList.id = shoppingList.id;
            }
          })
        );
      }
    }
  }

  public delete(): Promise<boolean>|undefined {
    if (this.shoppingList?.id) {
      this.deleteSubscription = this.shoppingListService.delete(this.shoppingList.id).subscribe(() => {
        return this.router.navigate([ShoppingListRoutes.displayShoppingListsRoute]);
      });
    }
    return undefined;
  }

  public goToDisplay(): Promise<boolean>|undefined {
    if (this.shoppingList?.id) {
      return this.router.navigate([ShoppingListRoutes.displayShoppingListRoute], { queryParams: { id: this.shoppingList.id } });
    }
    return undefined;
  }
}