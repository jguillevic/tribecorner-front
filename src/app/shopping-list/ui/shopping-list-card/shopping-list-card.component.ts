import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingList } from '../../model/shopping-list.model';
import { Observable, map, of } from 'rxjs';
import { ItemShoppingList } from '../../model/item-shopping-list.model';

@Component({
  selector: 'app-shopping-list-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './shopping-list-card.component.html',
  styles: [
  ]
})
export class ShoppingListCardComponent implements OnInit {
  @Input() public shoppingList: ShoppingList|undefined;

  public notCheckedItemShoppingLists$: Observable<ItemShoppingList[]|undefined>|undefined;
  public checkedItemShoppingLists$: Observable<ItemShoppingList[]|undefined>|undefined;
  public maxDisplayedItemsCount: number = 7;

  public ngOnInit(): void {
    this.notCheckedItemShoppingLists$ = of(this.shoppingList)
    .pipe(
      map(shoppingList => shoppingList?.items.filter(item => !item.isChecked))
    );

    this.checkedItemShoppingLists$ = of(this.shoppingList)
    .pipe(
      map(shoppingList => shoppingList?.items.filter(item => item.isChecked))
    )
  }
}
