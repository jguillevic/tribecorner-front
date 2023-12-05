import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-meal-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simple-meal-card.component.html',
  styleUrls: ['simple-meal-card.component.scss']
})

export class SimpleMealCardComponent {
  @Input() public name: string|undefined;
}