import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meal-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meal-card.component.html',
  styleUrls: ['meal-card.component.scss']
})

export class MealCardComponent {
  @Input() public name: string|undefined;
}