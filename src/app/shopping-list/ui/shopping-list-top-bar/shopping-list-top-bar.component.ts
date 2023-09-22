import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Location } from '@angular/common'
import { Observable, Subscription } from 'rxjs';

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
export class ShoppingListTopBarComponent implements OnDestroy {
  private beforeGoBackSubscription: Subscription|undefined;

  @Input() goToEdit: (() => Promise<boolean>|undefined)|undefined;
  @Input() goToDisplay: (() => Promise<boolean>|undefined)|undefined;
  @Input() delete: (() => Promise<boolean>|undefined)|undefined;
  @Input() beforeGoBack: (() => Observable<any>)|undefined;

  public constructor(private location: Location) { }

  public ngOnDestroy(): void {
    this.beforeGoBackSubscription?.unsubscribe();
  }

  public goBack(): void {
    if (this.beforeGoBack) {
      this.beforeGoBackSubscription = this.beforeGoBack().subscribe(() => this.location.back());
    } else {
      this.location.back();
    }
  }
}
