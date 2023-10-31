import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingList } from '../../model/shopping-list.model';

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
export class ShoppingListCardComponent {
  @Input() public shoppingList: ShoppingList|undefined;

  public maxDisplayedItemsCount: number = 7;
}
