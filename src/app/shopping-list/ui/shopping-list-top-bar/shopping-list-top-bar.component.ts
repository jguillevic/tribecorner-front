import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Location } from '@angular/common'

@Component({
  selector: 'app-shopping-list-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './shopping-list-top-bar.component.html',
  styles: [
  ]
})
export class ShoppingListTopBarComponent {
  @Input() goToEdit: (() => Promise<boolean>|undefined)|undefined;
  @Input() goToDisplay: (() => Promise<boolean>|undefined)|undefined;
  @Input() delete: (() => Promise<boolean>|undefined)|undefined;

  public constructor(private location: Location) { }

  public goBack(): void {
    this.location.back();
  }
}
