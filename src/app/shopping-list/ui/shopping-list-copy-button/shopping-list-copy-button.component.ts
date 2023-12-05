import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, tap } from 'rxjs';
import { ShoppingList } from '../../model/shopping-list.model';
import { ShoppingListService } from '../../service/shopping-list.service';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingListHelper } from '../../helper/shopping-list.helper';

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
  private destroy$: Subject<void> = new Subject<void>();

  public isCopying: boolean = false;

  @Input() public shoppingListToCopy: ShoppingList = new ShoppingList();
  @Output() public onShoppingListCopied: EventEmitter<ShoppingList> = new EventEmitter<ShoppingList>();

  public constructor(
    private shoppingListService: ShoppingListService
  ) { }

  public ngOnDestroy(): void {
    this.destroy$.complete();
  }

  public copy(): void {
    this.isCopying = true;
    const copiedShoppingList = ShoppingListHelper.copy(this.shoppingListToCopy, false);
    copiedShoppingList.isArchived = false;
    this.shoppingListService.create(copiedShoppingList)
    .pipe(
      takeUntil(this.destroy$),
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
