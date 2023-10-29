import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ItemShoppingList } from '../../model/item-shopping-list.model';
import { ShoppingList } from '../../model/shopping-list.model';
import { Observable, Subscription, mergeMap, shareReplay, switchMap } from 'rxjs';
import { ShoppingListService } from '../../service/shopping-list.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ShoppingListTopBarComponent } from "../shopping-list-top-bar/shopping-list-top-bar.component";
import { FormsModule } from '@angular/forms';
import { Action } from 'src/app/common/action';
import { Mode } from '../mode';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";

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
        ShoppingListTopBarComponent,
        SimpleLoadingComponent
    ]
})
export class DisplayShoppingListComponent implements OnDestroy {
  private deleteSubscription: Subscription|undefined;
  
  public readonly shoppingList$: Observable<ShoppingList> 
  = this.activatedRoute.queryParams
  .pipe(
    mergeMap(params => {
        const shoppingListId: number = params['id'];
        return this.shoppingListService.loadOneById(shoppingListId);
    }),
    shareReplay(1)
  );

  public constructor(
    private activatedRoute: ActivatedRoute,
    private shoppingListService: ShoppingListService
  ) { }

  public ngOnDestroy(): void {
    this.deleteSubscription?.unsubscribe();
  }

  public checkItem(itemShoppingList: ItemShoppingList): void {
    itemShoppingList.isChecked = !itemShoppingList.isChecked;
  }
}
