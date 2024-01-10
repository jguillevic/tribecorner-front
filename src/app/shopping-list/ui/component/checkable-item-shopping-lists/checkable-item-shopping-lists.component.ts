import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemShoppingList} from '../../../model/item-shopping-list.model';
import {Observable, Subject} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ItemShoppingListGoToService} from '../../../service/item-shopping-list-go-to.service';

@Component({
  selector: 'app-checkable-item-shopping-lists',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule
],
  templateUrl: './checkable-item-shopping-lists.component.html',
  styleUrls: [
    './checkable-item-shopping-lists.component.scss'
  ]
})
export class CheckableItemShoppingListsComponent implements OnDestroy {
    @Input() public itemShoppingLists: ItemShoppingList[] = [];
    @Output() public itemShoppingListDeleted: EventEmitter<ItemShoppingList> = new EventEmitter<ItemShoppingList>();
    @Output() public itemShoppingListToggled: EventEmitter<ItemShoppingList> = new EventEmitter<ItemShoppingList>();

    private readonly destroy$ = new Subject<void>();

    public constructor(
        private readonly itemShoppingListGoToService: ItemShoppingListGoToService
    ) {}

    public ngOnDestroy(): void {
        this.destroy$.complete();
    }
    
    public trackByItemShoppingList(index: number, itemShoppingList: ItemShoppingList): string {
        return `${itemShoppingList.name}${itemShoppingList.id??0}`;
    }

    public goToItemShoppingListUpdate(itemShoppingListId: number|undefined): Observable<boolean> {
        return this.itemShoppingListGoToService.goToUpdate(itemShoppingListId);
      }

    public deleteItemShoppingList(itemShoppingList: ItemShoppingList): void {
        this.itemShoppingListDeleted.emit(itemShoppingList);
    }

    public toggleItemShoppingList(itemShoppingList: ItemShoppingList): void {
        itemShoppingList.isChecked = !itemShoppingList.isChecked;
        this.itemShoppingListToggled.emit(itemShoppingList);
    }
}
