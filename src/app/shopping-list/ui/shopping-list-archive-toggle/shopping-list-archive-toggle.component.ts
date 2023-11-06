import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingList } from '../../model/shopping-list.model';
import { ShoppingListService } from '../../service/shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list-archive-toggle',
  standalone: true,
  imports: [
    CommonModule,
    MtxButtonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './shopping-list-archive-toggle.component.html',
  styles: [
  ]
})
export class ShoppingListArchiveToggleComponent implements OnDestroy {
  @Input() public shoppingListToToggleArchive: ShoppingList|undefined;
  @Output() public onShoppingListArchiveToggled: EventEmitter<ShoppingList> = new EventEmitter<ShoppingList>();

  private toggleArchiveSubscription: Subscription|undefined;

  public isTogglingArchive: boolean = false;

  public constructor(
    private shoppingListService: ShoppingListService
  ) { }

  public ngOnDestroy(): void {
    this.toggleArchiveSubscription?.unsubscribe();
  }

  public toggleArchive(): void {
    this.isTogglingArchive = true;
    if (this.shoppingListToToggleArchive) {
      this.shoppingListToToggleArchive.isArchived = !this.shoppingListToToggleArchive.isArchived;
      this.onShoppingListArchiveToggled.emit();
    }
    this.isTogglingArchive = false;
  }
}
