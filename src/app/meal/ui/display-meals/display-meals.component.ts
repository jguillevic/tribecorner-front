import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileTopBarComponent } from "../../../common/top-bar/profile/ui/profile-top-bar.component";
import { TabBarComponent } from "../../../common/tab-bar/ui/tab-bar/tab-bar.component";
import { Meal } from '../../model/meal.model';
import { InlineCalendarComponent } from "../../../common/calendar/ui/inline-calendar/inline-calendar.component";
import { MealKind } from '../../model/meal-kind.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-display-meals',
    standalone: true,
    templateUrl: './display-meals.component.html',
    styles: [],
    imports: [
      CommonModule,
      ProfileTopBarComponent,
      TabBarComponent,
      InlineCalendarComponent,
      MatIconModule,
      MatButtonModule
    ]
})
export class DisplayMealsComponent implements OnInit, OnDestroy {
  public mealKinds: MealKind[] = [];
  public meals: Meal[] = [];

  public constructor() {
    
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }
}