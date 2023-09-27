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
import { Observable, Subscription, interval, map, of, switchMap } from 'rxjs';
import { TabBarComponent } from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserInfo } from 'src/app/user/model/user-info.model';
import { UserService } from 'src/app/user/service/user.service';
import { ShoppingListTopBarComponent } from "../shopping-list-top-bar/shopping-list-top-bar.component";
import { ShoppingListRoutes } from '../../route/shopping-list.routes';
import { Action } from 'src/app/common/action';
import { Mode } from '../mode';

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
  private initShoppingListSubscription: Subscription|undefined;
  private deleteSubscription: Subscription|undefined;

  public newItemShopListName: string = '';
  public shoppingList: ShoppingList|undefined;
  public currentAction: Action = Action.create;
  public currentMode: Mode = Mode.edit;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private shoppingListService: ShoppingListService
    ) { }

  public ngOnInit(): void {
    this.initShoppingListSubscription = this.activatedRoute.queryParams
    .pipe(
      switchMap((params: Params) => {
        this.currentAction = params['action'];

        if (this.currentAction == Action.create) {
          const shoppingList: ShoppingList = new ShoppingList();
          const currentUserInfo: UserInfo|undefined = this.userService.getCurrentUserInfo();
          if (currentUserInfo?.familyId) {
            shoppingList.familyId = currentUserInfo?.familyId;
          }
          return of(shoppingList);
        } else if (this.currentAction == Action.update) {
          const shoppingListId: number = params['id'];
          return this.shoppingListService.loadOneById(shoppingListId);
        }
        return of(undefined);
      })
    )
    .subscribe(shoppingList => {
      this.shoppingList = shoppingList;
    });
  }

  public ngOnDestroy(): void {
    this.initShoppingListSubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
  }

  public addItem(): void {
    if (this.shoppingList &&
      this.newItemShopListName.length) {
      const itemShoppingList: ItemShoppingList  = new ItemShoppingList();
      itemShoppingList.name = this.newItemShopListName;
      this.shoppingList.items.push(itemShoppingList);
      itemShoppingList.position = this.shoppingList.items.indexOf(itemShoppingList) + 1;
      this.newItemShopListName = '';
    }
  }

  public deleteItem(itemShoppingList: ItemShoppingList): void {
    if (this.shoppingList) {
      const itemIndex: number = this.shoppingList.items.indexOf(itemShoppingList);
      this.shoppingList.items.splice(itemIndex, 1);
    }
  }
}