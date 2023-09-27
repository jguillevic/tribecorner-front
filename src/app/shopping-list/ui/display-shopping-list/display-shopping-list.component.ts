import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ItemShoppingList } from '../../model/item-shopping-list.model';
import { ShoppingList } from '../../model/shopping-list.model';
import { Subscription, switchMap } from 'rxjs';
import { ShoppingListService } from '../../service/shopping-list.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ShoppingListTopBarComponent } from "../shopping-list-top-bar/shopping-list-top-bar.component";
import { FormsModule } from '@angular/forms';
import { Action } from 'src/app/common/action';
import { Mode } from '../mode';

@Component({
    selector: 'app-display-shopping-list',
    standalone: true,
    templateUrl: './display-shopping-list.component.html',
    styles: [],
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        FormsModule,
        ShoppingListTopBarComponent
    ]
})
export class DisplayShoppingListComponent implements OnInit, OnDestroy {
  private initShoppingListSubscription: Subscription|undefined;
  private deleteSubscription: Subscription|undefined;

  public shoppingList: ShoppingList|undefined;
  public currentAction: Action = Action.update;
  public currentMode: Mode = Mode.display;
  
  public constructor(
    private activatedRoute: ActivatedRoute,
    private shoppingListService: ShoppingListService
    ) { }

  public ngOnInit(): void {
    this.initShoppingListSubscription = this.activatedRoute.queryParams
    .pipe(
      switchMap((params: Params) => {
          const shoppingListId: number = params['id'];
          return this.shoppingListService.loadOneById(shoppingListId);
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

  public checkItem(itemShoppingList: ItemShoppingList): void {
    itemShoppingList.isChecked = !itemShoppingList.isChecked;
  }
}
