import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingList } from '../../../model/shopping-list.model';
import { ShoppingListApiService } from '../../../service/shopping-list-api.service';
import { Subject, takeUntil, tap } from 'rxjs';

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

  private readonly destroy$ = new Subject<void>();

  public isTogglingArchive: boolean = false;

  public constructor(
    private shoppingListApiService: ShoppingListApiService
  ) { }

  public ngOnDestroy(): void {
    this.destroy$.complete();
  }

  public toggleArchive(): void {
    this.isTogglingArchive = true;
    if (this.shoppingListToToggleArchive) {
      this.shoppingListApiService.toggleArchive(this.shoppingListToToggleArchive)
      .pipe(
        takeUntil(this.destroy$),
        tap(updatedShoppingList => this.onShoppingListArchiveToggled.emit(updatedShoppingList)),
        tap(() => this.isTogglingArchive = false)
      )
      .subscribe(
        {
          error: () => this.isTogglingArchive = false
        }
      );
    }
  }
}
