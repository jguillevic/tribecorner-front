import { Injectable } from '@angular/core';
import { SuggestedItemShoppingListApiService } from './suggested-item-shopping-list-api.service';
import { SuggestedItemShoppingList } from '../model/suggested-item-shopping-list';
import { Observable, map } from 'rxjs';
import { ItemShoppingList } from '../model/item-shopping-list.model';

@Injectable()
export class SuggestedItemShoppingListAutoCompleteService {
    public constructor(
        private readonly suggestedItemShoppingListApiService: SuggestedItemShoppingListApiService
    ) { }

    public getSuggestedItemShoppingListsForAutoComplete(
        itemShoppingListName: string,
        alreadyEnteredItemShoppingList: ItemShoppingList[]
    ): Observable<SuggestedItemShoppingList[]> {
        return this.suggestedItemShoppingListApiService.allSuggestedItemShoppingLists$
        .pipe(
            map(allSuggestedItemLists => {
                if (itemShoppingListName.length > 0) {
                    const filterValue: string = itemShoppingListName.toLowerCase();
                    return allSuggestedItemLists
                    .filter(suggestedItemShoppingList => suggestedItemShoppingList.name.toLowerCase().includes(filterValue) &&
                    !alreadyEnteredItemShoppingList.map(itemShoppingList => itemShoppingList.name.toLowerCase()).includes(suggestedItemShoppingList.name.toLowerCase()))
                    .slice(0, 5);
                }
                return [];
            }),
        );
    }
}
