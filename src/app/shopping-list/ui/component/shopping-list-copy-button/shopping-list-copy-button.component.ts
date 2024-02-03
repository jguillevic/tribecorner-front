import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { Subject, takeUntil, tap } from 'rxjs';
import { ShoppingList } from '../../../model/shopping-list.model';
import { ShoppingListApiService } from '../../../service/shopping-list-api.service';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingListHelper } from '../../../helper/shopping-list.helper';

@Component({
  selector: 'app-shopping-list-copy-button',
  standalone: true,
  imports: [
    MtxButtonModule,
    MatButtonModule,
    MatIconModule
],
  templateUrl: './shopping-list-copy-button.component.html'
})
export class ShoppingListCopyButtonComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  public isCopying: boolean = false;

  @Input() public shoppingListToCopy: ShoppingList|undefined;
  @Output() public onShoppingListCopied: EventEmitter<ShoppingList> = new EventEmitter<ShoppingList>();

  public constructor(
    private shoppingListApiService: ShoppingListApiService
  ) { }

  public ngOnDestroy(): void {
    this.destroy$.complete();
  }

  public copy(): void {
    if (!this.shoppingListToCopy) {
      return;
    }

    this.isCopying = true;
    const copiedShoppingList = ShoppingListHelper.copy(this.shoppingListToCopy, false);
    copiedShoppingList.isArchived = false;
    this.shoppingListApiService.create(copiedShoppingList)
    .pipe(
      tap(
        copiedShoppingList =>
          this.onShoppingListCopied.emit(copiedShoppingList)
      ),
      tap(() => this.isCopying = false),
      takeUntil(this.destroy$)
    )
    .subscribe({
      error: () => this.isCopying = false,
    });
  }
}
