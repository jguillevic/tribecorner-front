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
import { Subscription, interval } from 'rxjs';
import { TabBarComponent } from 'src/app/common/tab-bar/ui/tab-bar/tab-bar.component';

@Component({
  selector: 'app-display-shopping-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TabBarComponent
  ],
  templateUrl: './edit-shopping-list.component.html',
  styles: [
  ]
})
export class EditShoppingListComponent implements OnInit, OnDestroy {
  private isEditing: boolean = false;
  private isSaving: boolean = false;
  private loadSubscription: Subscription|undefined;
  private timerSubscription: Subscription|undefined;
  private editSubscriptions: Subscription[] = [];

  public newItemShopListName: string = '';
  public shoppingList: ShoppingList | undefined;

  constructor(private shoppingListService: ShoppingListService) { }

  public ngOnInit(): void {
    this.loadSubscription = this.shoppingListService.load().subscribe((shoppingLists) => this.shoppingList = shoppingLists.at(0));
    this.timerSubscription = interval(1000).subscribe(() => this.save());
  }

  public ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.timerSubscription?.unsubscribe();
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