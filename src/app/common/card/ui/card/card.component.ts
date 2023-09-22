import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingList } from 'src/app/shopping-list/model/shopping-list.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './card.component.html',
  styles: [
  ]
})
export class CardComponent implements OnInit {
  @Input() public item: ShoppingList|undefined;
  @Input() public customBackgroundColorClass: string|undefined;
  @Input() public imgUrl: string|undefined;
  @Input() public label: string|undefined;
  @Input() public subText1: string|undefined;
  @Input() public subText2: string|undefined;
  @Input() public goToUpdate: ((id: number|undefined) => Promise<boolean>|undefined)|undefined;
  @Input() public goToDisplay: ((id: number|undefined) => Promise<boolean>|undefined)|undefined;
  @Input() public delete: ((item: any) => void)|undefined;

  public backgroundColorClass: string|undefined;

  public ngOnInit(): void {
    if (this.customBackgroundColorClass) {
      this.backgroundColorClass = this.customBackgroundColorClass;
    } else {
      // Classe de couleur de fond aléatoire.
      const randomNumber: number = CardComponent.getRandomNumber(8) + 1;
      this.backgroundColorClass = `bg-primary-color-${randomNumber}00`;
    }
  }

  private static getRandomNumber(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
