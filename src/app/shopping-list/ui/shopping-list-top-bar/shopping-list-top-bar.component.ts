import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subscription, of, tap } from 'rxjs';
import { ShoppingList } from '../../model/shopping-list.model';
import { ShoppingListService } from '../../service/shopping-list.service';
import { Router } from '@angular/router';
import { ShoppingListRoutes } from '../../route/shopping-list.routes';

@Component({
  selector: 'app-shopping-list-top-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './shopping-list-top-bar.component.html',
  styles: [
  ]
})
export class ShoppingListTopBarComponent implements OnDestroy {
  private saveSubscription: Subscription|undefined;

  @Input() public shoppingList: ShoppingList|undefined;

  public constructor(
    private router: Router,
    private shoppingListService: ShoppingListService
    ) {  }

  public ngOnDestroy(): void {
    this.saveSubscription?.unsubscribe();
  }

  public goBack(): void {
    this.saveSubscription 
    = this.save()
    .pipe(
      tap(() => this.router.navigate([ShoppingListRoutes.displayShoppingListsRoute]))
    )
    .subscribe();
  }

  private save(): Observable<ShoppingList|undefined> {
    if (this.shoppingList) {
      return this.shoppingListService.update(this.shoppingList);
    }
    return of(undefined);
  }
}
