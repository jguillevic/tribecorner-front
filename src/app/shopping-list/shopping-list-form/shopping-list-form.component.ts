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
      const itemShoppingList: ItemShoppingList  = new ItemShoppingList;
      itemShoppingList.name = this.newItemShopListName;
      this.shoppingList.items.push(itemShoppingList);
      this.newItemShopListName = '';
    }
  }

  deleteItem(itemShoppingList: ItemShoppingList): void {
    console.log('Demande de suppression d\'un élément de la liste.');
    console.log(itemShoppingList);
    const itemIndex = this.shoppingList.items.indexOf(itemShoppingList);
    this.shoppingList.items.splice(itemIndex, 1);
  }

  save(): void {
    console.log("Demande de sauvegarde de la liste.");
    console.log(this.shoppingList.name);
    console.table(this.shoppingList.items);
    this.shoppingListService.save(this.shoppingList);
  }
}