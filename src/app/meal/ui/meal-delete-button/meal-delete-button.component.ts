import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal } from '../../model/meal.model';
import { Subject, takeUntil, tap } from 'rxjs';
import { MealService } from '../../service/meal.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MtxButtonModule } from '@ng-matero/extensions/button';

@Component({
  selector: 'app-meal-delete-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MtxButtonModule
  ],
  templateUrl: './meal-delete-button.component.html',
  styles: [
  ]
})
export class MealDeleteButtonComponent implements OnDestroy {
  @Input() public mealToDelete: Meal|undefined;
  @Output() public onMealDeleted: EventEmitter<Meal> = new EventEmitter<Meal>();

  private readonly destroy$ = new Subject<void>();

  public isDeleting: boolean = false;

  public constructor(
    private mealService: MealService
  ) { }

  public ngOnDestroy(): void {
    this.destroy$.complete();
  }

  public delete() {
    if (this.mealToDelete && this.mealToDelete.id) {
      this.isDeleting = true;
      this.mealService.delete(this.mealToDelete.id)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => 
          this.onMealDeleted.emit(this.mealToDelete)
        ),
        tap(() => this.isDeleting = false)
      )
      .subscribe({
        error: () => this.isDeleting = false
      });
    }
  }
}
