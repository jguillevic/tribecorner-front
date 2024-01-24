import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-simple-meal-card',
  standalone: true,
  imports: [],
  templateUrl: './simple-meal-card.component.html',
  styleUrls: ['simple-meal-card.component.scss']
})

export class SimpleMealCardComponent {
  @Input() public name: string|undefined;
}