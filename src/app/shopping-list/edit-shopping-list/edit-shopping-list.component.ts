import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../shopping-list.service';
import { ShoppingList } from '../shopping-list';
import { ShoppingListFormComponent } from '../shopping-list-form/shopping-list-form.component';

@Component({
  selector: 'app-edit-shopping-list',
  standalone: true,
  imports: [ShoppingListFormComponent, CommonModule],
  templateUrl: './edit-shopping-list.component.html',
  styles: [
  ]
})
export class EditShoppingListComponent implements OnInit {
  shoppingList: ShoppingList = new ShoppingList;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.shoppingListService.get().subscribe((shoppingList) => this.shoppingList = shoppingList);
  }
}
