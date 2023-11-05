import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { Subscription, tap } from 'rxjs';
import { ShoppingList } from '../../model/shopping-list.model';
import { ShoppingListService } from '../../service/shopping-list.service';
import { ShoppingListCopierService } from '../../service/shopping-list-copier.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shopping-list-copy-button',
  standalone: true,
  imports: [
    CommonModule,
    MtxButtonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './shopping-list-copy-button.component.html'
})
export class ShoppingListCopyButtonComponent implements OnDestroy {
  private copySubscription: Subscription|undefined;

  public isCopying: boolean = false;

  @Input() public shoppingListToCopy: ShoppingList = new ShoppingList();
  @Output() public onShoppingListCopied: EventEmitter<ShoppingList> = new EventEmitter<ShoppingList>();

  public constructor(
    private shoppingListService: ShoppingListService,
    private shoppingListCopierService: ShoppingListCopierService
  ) { }

  public ngOnDestroy(): void {
    this.copySubscription?.unsubscribe();
  }

  public copy(): void {
    this.isCopying = true;
    const copiedShoppingList = this.shoppingListCopierService.copy(this.shoppingListToCopy, false);
    this.copySubscription = this.shoppingListService.create(copiedShoppingList)
    .pipe(
      tap(
        copiedShoppingList => 
          this.onShoppingListCopied.emit(copiedShoppingList)
      ),
      tap(() => this.isCopying = false)
    )
    .subscribe({
      error: () => this.isCopying = false,
    });
  }
}
