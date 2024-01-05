import { Injectable } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';
import { SuggestedItemShoppingList } from '../model/suggested-item-shopping-list';

@Injectable()
export class SuggestedItemShoppingListApiService {
    public allSuggestedItemShoppingLists$: Observable<SuggestedItemShoppingList[]> 
    = this.getAll()
    .pipe(
        shareReplay(1)
    );

    public constructor() { }

    public getAll(): Observable<SuggestedItemShoppingList[]> {
        return of([
            new SuggestedItemShoppingList('Litière'),
            new SuggestedItemShoppingList('Beurre'),
            new SuggestedItemShoppingList('Pommes'),
            new SuggestedItemShoppingList('Poires'),
            new SuggestedItemShoppingList('Fraises'),
            new SuggestedItemShoppingList('Escalope de dinde')
        ]);
    }
}
