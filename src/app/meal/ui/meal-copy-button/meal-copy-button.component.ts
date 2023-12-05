import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, takeUntil, tap } from 'rxjs';
import { Meal } from '../../model/meal.model';
import { MealService } from '../../service/meal.service';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MealHelper } from '../../helper/meal.helper';

@Component({
  selector: 'app-meal-copy-button',
  standalone: true,
  imports: [
    CommonModule,
    MtxButtonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './meal-copy-button.component.html',
  styles: [
  ]
})
export class MealCopyButtonComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  public isCopying: boolean = false;

  @Input() public mealToCopy: Meal|undefined;
  @Output() public onMealCopied: EventEmitter<Meal> = new EventEmitter<Meal>();

  public constructor(
    private mealService: MealService
  ) { }

  public ngOnDestroy(): void {
    this.destroy$.complete();
  }

  public copy(): void {
    if (!this.mealToCopy) {
      return;
    }

    this.isCopying = true;
    const copiedMeal = MealHelper.copy(this.mealToCopy, false);
    this.mealService.create(copiedMeal)
    .pipe(
      takeUntil(this.destroy$),
      tap(
        copiedMeal => 
          this.onMealCopied.emit(copiedMeal)
      ),
      tap(() => this.isCopying = false)
    )
    .subscribe({
      error: () => this.isCopying = false,
    });
  }
}
