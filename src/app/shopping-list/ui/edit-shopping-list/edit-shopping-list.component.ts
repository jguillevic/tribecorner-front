import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../service/shopping-list.service';
import { ShoppingList } from '../../model/shopping-list.model';
import { ToolbarComponent } from 'src/app/common/toolbar/ui/toolbar/toolbar.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ItemShoppingList } from '../../model/item-shopping-list.model';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-display-shopping-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarComponent,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './edit-shopping-list.component.html',
  styles: [
  ]
})
export class EditShoppingListComponent implements OnInit, OnDestroy {
  private isEditing: boolean = false;
  private isSaving: boolean = false;
  private getSubscription: Subscription |undefined;
  private timerSubscription: Subscription |undefined;
  private editSubscriptions: Subscription[] = [];

  public newItemShopListName: string = '';
  public shoppingList: ShoppingList | undefined;

  constructor(private shoppingListService: ShoppingListService) { }

  public ngOnInit(): void {
    this.getSubscription = this.shoppingListService.get().subscribe((shoppingLists) => this.shoppingList = shoppingLists.at(0));
    this.timerSubscription = interval(1000).subscribe(() => this.save());
  }

  public ngOnDestroy(): void {
    if (this.getSubscription) {
      this.getSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

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

      this.editSubscriptions.push(
        this.shoppingListService.edit(this.shoppingList).subscribe(() => { 
          this.isEditing = false;
          this.isSaving = false; 
        })
      );
    }
  }
}