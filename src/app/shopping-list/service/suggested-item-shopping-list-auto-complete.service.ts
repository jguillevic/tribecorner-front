import {Injectable} from '@angular/core';
import {SuggestedItemShoppingListApiService} from './suggested-item-shopping-list-api.service';
import {SuggestedItemShoppingList} from '../model/suggested-item-shopping-list';
import {Observable, map} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SuggestedItemShoppingListAutoCompleteService {
    public constructor(
        private readonly suggestedItemShoppingListApiService: SuggestedItemShoppingListApiService
    ) { }

    public getSuggestedItemShoppingListsForAutoComplete(
        itemShoppingListName: string
    ): Observable<SuggestedItemShoppingList[]> {
        return this.suggestedItemShoppingListApiService.allSuggestedItemShoppingLists$
        .pipe(
            map(suggestedItemShoppingLists => {
                if (itemShoppingListName.length > 0) {
                    const filterValue: string = itemShoppingListName.toLowerCase();
                    const filteredLists = suggestedItemShoppingLists
                    .filter(suggestedItemShoppingList => suggestedItemShoppingList.name.toLowerCase().includes(filterValue))
                    
                    const sortedLists = filteredLists.sort((a, b) => {
                        // Tri par count en ordre décroissant.
                        const countComparison = b.count - a.count;
                    
                        // Si les counts sont égaux, tri par name en ordre croissant.
                        if (countComparison === 0) {
                            return a.name.localeCompare(b.name);
                        }
                    
                        return countComparison;
                    });

                    return sortedLists.slice(0, 5);
                }
                return [];
            }),
        );
    }
}
