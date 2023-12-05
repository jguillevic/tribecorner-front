import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { ShoppingList } from '../../model/shopping-list.model';
import { ShoppingListService } from '../../service/shopping-list.service';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-shopping-list-completed-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, 
    MatDialogModule,
    MtxButtonModule
  ],
  templateUrl: './shopping-list-completed-dialog.component.html',
  styles: [
  ]
})
export class ShoppingListCompletedDialogComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  public isTogglingArchive: boolean = false;

  public constructor(
    private shoppingListService: ShoppingListService,
    private location: Location,
    @Inject(MAT_DIALOG_DATA) private shoppingList: ShoppingList
  ) { }

  public ngOnDestroy(): void {
    this.destroy$.complete();
  }

  public onArchiveClicked(): void {
    this.isTogglingArchive = true;
    this.shoppingListService.toggleArchive(this.shoppingList)
    .pipe(
      takeUntil(this.destroy$),
      tap(() => this.location.back())
    )
    .subscribe(
      {
        error: () => this.isTogglingArchive = false
      }
    );
  }
}
