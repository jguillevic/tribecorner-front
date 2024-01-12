import { Injectable } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';
import { SuggestedItemShoppingList } from '../model/suggested-item-shopping-list';
import { ApiHttpClient } from '../../common/http/api-http-client';
import { environment } from '../../../environments/environment';

@Injectable()
export class SuggestedItemShoppingListApiService {
    private static apiPath: string = "suggested_item_shopping_lists";

    public allSuggestedItemShoppingLists$: Observable<SuggestedItemShoppingList[]> 
    = this.loadAll()
    .pipe(
        shareReplay(1)
    );

    public constructor(
        private apiHttp: ApiHttpClient
    ) { }

    public loadAll(): Observable<SuggestedItemShoppingList[]> {
        return this.apiHttp.get<SuggestedItemShoppingList[]>(
            `${environment.apiUrl}${SuggestedItemShoppingListApiService.apiPath}`
        );
    }
}
