import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { ItemShoppingListRoutes } from '../route/item-shopping-list.routes';

@Injectable({
  providedIn: 'root',
})
export class ItemShoppingListGoToService {
    public constructor(
        private readonly router: Router
    ) { }

    public goToUpdate(shoppingListId: number|undefined): Observable<boolean> {
        if (shoppingListId) {
            return from(this.router.navigate([ItemShoppingListRoutes.editItemShoppingListRoute], { queryParams: { id: shoppingListId } }));
        }

        return of(false);
    }
}
