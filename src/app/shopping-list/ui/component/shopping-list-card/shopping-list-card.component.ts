import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShoppingList} from '../../../model/shopping-list.model';
import {Observable, map, of} from 'rxjs';
import {ItemShoppingList} from '../../../model/item-shopping-list.model';
import {MatCardModule} from '@angular/material/card';
import {ShoppingListEditButtonComponent} from "../shopping-list-edit-button/shopping-list-edit-button.component";
import {ShoppingListCopyButtonComponent} from "../shopping-list-copy-button/shopping-list-copy-button.component";
import {ShoppingListArchiveToggleComponent} from "../shopping-list-archive-toggle/shopping-list-archive-toggle.component";
import {ShoppingListDeleteButtonComponent} from "../shopping-list-delete-button/shopping-list-delete-button.component";
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';

@Component({
    selector: 'app-shopping-list-card',
    standalone: true,
    templateUrl: './shopping-list-card.component.html',
    styleUrl: '../common/shopping-list-card.component.scss',
    imports: [
        CommonModule,
        MatCardModule,
        ShoppingListEditButtonComponent,
        ShoppingListCopyButtonComponent,
        ShoppingListArchiveToggleComponent,
        ShoppingListDeleteButtonComponent,
        NgxSkeletonLoaderModule
    ]
})
export class ShoppingListCardComponent implements OnInit {
    @Input() public shoppingList: ShoppingList|undefined;
    @Input() public showActions: boolean = true;
    @Output() public onShoppingListCopied: EventEmitter<ShoppingList> = new EventEmitter<ShoppingList>();
    @Output() public onShoppingListArchiveToggled: EventEmitter<ShoppingList> = new EventEmitter<ShoppingList>();
    @Output() public onShoppingListDeleted: EventEmitter<ShoppingList> = new EventEmitter<ShoppingList>();

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
        );
    }

    public shoppingListCopied(shoppingList: ShoppingList): void {
        this.onShoppingListCopied.emit(shoppingList);
    }

    public shoppingListArchiveToggled(shoppingList: ShoppingList): void {
        this.onShoppingListArchiveToggled.emit(shoppingList);
    }

    public shoppingListDeleted(shoppingList: ShoppingList): void {
        this.onShoppingListDeleted.emit(shoppingList);
    }
}
