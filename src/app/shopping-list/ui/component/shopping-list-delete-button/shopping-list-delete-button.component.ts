import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingList } from '../../../model/shopping-list.model';
import { Subscription, tap } from 'rxjs';
import { ShoppingListService } from '../../../service/shopping-list.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MtxButtonModule } from '@ng-matero/extensions/button';

@Component({
  selector: 'app-shopping-list-delete-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MtxButtonModule
  ],
  templateUrl: './shopping-list-delete-button.component.html'
})
export class ShoppingListDeleteButtonComponent implements OnDestroy {
  @Input() public shoppingListToDelete: ShoppingList|undefined;
  @Output() public onShoppingListDeleted: EventEmitter<ShoppingList> = new EventEmitter<ShoppingList>();

  private deleteSubscription: Subscription|undefined;

  public isDeleting: boolean = false;

  public constructor(
    private shoppingListService: ShoppingListService
  ) { }

  public ngOnDestroy(): void {
    this.deleteSubscription?.unsubscribe();
  }

  public delete() {
    if (this.shoppingListToDelete && this.shoppingListToDelete.id) {
      this.isDeleting = true;
      this.deleteSubscription = this.shoppingListService.delete(this.shoppingListToDelete.id)
      .pipe(
        tap(() => 
          this.onShoppingListDeleted.emit(this.shoppingListToDelete)
        ),
        tap(() => this.isDeleting = false)
      )
      .subscribe({
        error: () => this.isDeleting = false
      });
    }
  }
}
