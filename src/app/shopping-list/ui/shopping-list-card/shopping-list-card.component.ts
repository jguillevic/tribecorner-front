import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingList } from '../../model/shopping-list.model';

@Component({
  selector: 'app-shopping-list-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-list-card.component.html',
  styles: [
  ]
})
export class ShoppingListCardComponent implements OnInit {
  @Input() public shoppingList: ShoppingList|undefined;

  public backgroundColorClass: string|undefined;

  public ngOnInit(): void {
    const randomNumber: number = ShoppingListCardComponent.getRandomNumber(8) + 1;
    this.backgroundColorClass = `bg-primary-color-${randomNumber}00`;
  }

  private static getRandomNumber(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
