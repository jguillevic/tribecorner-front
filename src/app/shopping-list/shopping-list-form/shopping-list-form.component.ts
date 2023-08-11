import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingList } from '../shopping-list';
import { ItemShoppingList } from '../item-shopping-list';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  standalone: true,
  selector: 'app-shopping-list-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-list-form.component.html',
  styles: [
  ]
})
export class ShoppingListFormComponent {
  @Input() shoppingList: ShoppingList = new ShoppingList;
  newItemShopListName: string = '';

  constructor(private shoppingListService: ShoppingListService) { }

  addItem(): void {
    if (this.newItemShopListName.length) {
      const itemShoppingList: ItemShoppingList  = new ItemShoppingList();
      itemShoppingList.name = this.newItemShopListName;
      this.shoppingList.items.push(itemShoppingList);
      itemShoppingList.position = this.shoppingList.items.indexOf(itemShoppingList) + 1;
      this.newItemShopListName = '';
    }
  }

  deleteItem(itemShoppingList: ItemShoppingList): void {
    const itemIndex: number = this.shoppingList.items.indexOf(itemShoppingList);
    this.shoppingList.items.splice(itemIndex, 1);
  }

  save(): void {
    this.shoppingListService.edit(this.shoppingList).subscribe();
  }
}