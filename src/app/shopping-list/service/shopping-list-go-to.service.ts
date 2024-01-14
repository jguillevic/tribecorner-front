import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingListRoutes } from '../route/shopping-list.routes';
import { Observable, from, of } from 'rxjs';

@Injectable()
export class ShoppingListGoToService {
    public constructor(
        private readonly router: Router
    ) { }

    public goToCreate(): Observable<boolean> {
        return from(this.router.navigate([ShoppingListRoutes.editShoppingListRoute], { queryParams: { action: 'create' } }));
    }
    
    public goToUpdate(shoppingListId: number|undefined): Observable<boolean> {
        if (shoppingListId) {
            return from(this.router.navigate([ShoppingListRoutes.editShoppingListRoute], { queryParams: { action: 'update', id: shoppingListId } }));
        }

        return of(false);
    }
}
