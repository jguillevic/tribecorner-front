import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ItemShoppingList } from '../../model/item-shopping-list.model';
import { ShoppingList } from '../../model/shopping-list.model';
import { Observable, Subscription, of, switchMap } from 'rxjs';
import { ShoppingListService } from '../../service/shopping-list.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ShoppingListTopBarComponent } from "../shopping-list-top-bar/shopping-list-top-bar.component";
import { ShoppingListRoutes } from '../../route/shopping-list.routes';
import { FormsModule } from '@angular/forms';

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
  private isEditing: boolean = false;
  private initShoppingListSubscription: Subscription|undefined;
  private deleteSubscription: Subscription|undefined;

  public shoppingList: ShoppingList|undefined;
  public boundedDelete: (() => Promise<boolean>|undefined)|undefined;
  public boundedGoToEdit: (() => Promise<boolean>|undefined)|undefined;
  public boundedSave: (() => Observable<ShoppingList|undefined>)|undefined;
  
  public constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private shoppingListService: ShoppingListService
    ) { }

  public ngOnInit(): void {
    this.boundedDelete = this.delete.bind(this);
    this.boundedGoToEdit = this.goToEdit.bind(this);
    this.boundedSave = this.save.bind(this);

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

    this.isEditing = true;
  }

  public delete(): Promise<boolean>|undefined {
    if (this.shoppingList?.id) {
      this.deleteSubscription = this.shoppingListService.delete(this.shoppingList.id).subscribe(() => {
        return this.router.navigate([ShoppingListRoutes.displayShoppingListsRoute]);
      });
    }
    return undefined;
  }

  public goToEdit(): Promise<boolean>|undefined {
    if (this.shoppingList?.id) {
      return this.router.navigate([ShoppingListRoutes.editShoppingListRoute], { queryParams: { action: 'update', id: this.shoppingList.id } });
    }
    return undefined;
  }

  public save(): Observable<ShoppingList|undefined> {
    if (this.shoppingList) {
      return this.shoppingListService.update(this.shoppingList);
    }
    return of(undefined);
  }
}
