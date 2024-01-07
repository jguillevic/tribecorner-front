import { Injectable } from '@angular/core';
import { ItemShoppingList } from '../model/item-shopping-list.model';
import { Observable, of } from 'rxjs';

@Injectable()
export class ItemShoppingListApiService {
    public constructor() { }

    public loadOneById(id: number): Observable<ItemShoppingList> {
        return of(new ItemShoppingList(id, 'Nom', true, 2));
    }

    public upate(itemShoppingList: ItemShoppingList): Observable<ItemShoppingList> {
        return of(itemShoppingList);
    }
}
