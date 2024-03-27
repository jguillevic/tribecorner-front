import {Injectable} from '@angular/core';
import {Observable, map, of, shareReplay} from 'rxjs';
import {SuggestedItemShoppingList} from '../model/suggested-item-shopping-list';
import {ApiHttpClient} from '../../common/http/api-http-client';
import {environment} from '../../../environments/environment';
import {SuggestedItemShoppingListDto} from '../dto/suggested-item-shopping-list.dto';
import {SuggestedItemShoppingListConverter} from '../converter/suggested-item-shopping-list.converter';

@Injectable({
  providedIn: 'root',
})
export class SuggestedItemShoppingListApiService {
    private static apiPath: string = "suggested_item_shopping_lists";

    public allSuggestedItemShoppingLists$: Observable<SuggestedItemShoppingList[]> 
    = this.loadAll()
    .pipe(
        shareReplay(1)
    );

    public constructor(
        private readonly apiHttp: ApiHttpClient
    ) { }

    public loadAll(): Observable<SuggestedItemShoppingList[]> {
        return this.apiHttp.get<SuggestedItemShoppingListDto[]>(
            `${environment.apiUrl}${SuggestedItemShoppingListApiService.apiPath}`
        )
        .pipe(
            map((suggestedItemShoppingListDtos: SuggestedItemShoppingListDto[]) => 
            suggestedItemShoppingListDtos.map((suggestedItemShoppingListDto: SuggestedItemShoppingListDto) =>
                SuggestedItemShoppingListConverter.fromDtoToModel(suggestedItemShoppingListDto))
            )
        );
    }
}
