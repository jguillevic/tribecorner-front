import { Component, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { MealRoutes } from '../../../route/meal.routes';
import { MealGoToService } from '../../../service/meal-go-to.service';

@Component({
  selector: 'app-meal-edit-button',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MtxButtonModule
],
  templateUrl: './meal-edit-button.component.html',
  styles: [
  ]
})
export class MealEditButtonComponent {
  @Input() public mealId: number = 0;

  public isGoingToEdit: boolean = false;

  public constructor(
    private mealGoToService: MealGoToService
  ) { }

  public goToEdit(): Observable<boolean> {
    this.isGoingToEdit = true;
    return this.mealGoToService.goToUpdate(this.mealId);
  }
}
