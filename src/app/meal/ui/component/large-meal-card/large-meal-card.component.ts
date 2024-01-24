import { Component, Input } from '@angular/core';

import { Meal } from '../../../model/meal.model';

@Component({
  selector: 'app-large-meal-card',
  standalone: true,
  imports: [],
  templateUrl: './large-meal-card.component.html',
  styleUrls: [
    './large-meal-card.component.scss'
  ]
})
export class LargeMealCardComponent {
  @Input() public meal: Meal|undefined;

  
}
