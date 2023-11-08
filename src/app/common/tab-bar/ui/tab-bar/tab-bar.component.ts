import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HomeRoutes } from 'src/app/home/route/home.routes';
import { ShoppingListRoutes } from 'src/app/shopping-list/route/shopping-list.routes';
import { MealRoutes } from 'src/app/meal/route/meal.routes';
import { MatDividerModule } from '@angular/material/divider';
import { EventRoutes } from 'src/app/event/route/event.routes';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './tab-bar.component.html',
  styleUrls: ['tab-bar.component.scss']
})
export class TabBarComponent {
  @Input() public selectedIndex: number = -1;
  @Output() public onActionClicked: EventEmitter<void> = new EventEmitter();

  public actionButtonIcon: string = "add";

  public constructor(private router: Router) { }

  public goToHome(): Promise<boolean> {
    return this.router.navigate([HomeRoutes.displayHomeRoute]);
  }

  public goToShoppingLists(): Promise<boolean> {
    return this.router.navigate([ShoppingListRoutes.displayShoppingListsRoute]);
  }

  public goToMeals(): Promise<boolean> {
    return this.router.navigate([MealRoutes.displayMealsRoute]);
  }

  public goToEvents(): Promise<boolean> {
    return this.router.navigate([EventRoutes.displayEventsRoute]);
  }

  public actionClicked(): void {
    this.onActionClicked.emit();
  }
}