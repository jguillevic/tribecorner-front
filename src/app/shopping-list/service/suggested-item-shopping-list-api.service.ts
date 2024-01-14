import { Injectable } from '@angular/core';
import { Observable, map, of, shareReplay } from 'rxjs';
import { SuggestedItemShoppingList } from '../model/suggested-item-shopping-list';
import { ApiHttpClient } from '../../common/http/api-http-client';
import { environment } from '../../../environments/environment';
import { LoadSuggestedItemShoppingListDto } from '../dto/load-suggested-item-shopping-list.dto';
import { SuggestedItemShoppingListConverter } from '../converter/suggested-item-shopping-list.converter';

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
        return this.apiHttp.get<LoadSuggestedItemShoppingListDto[]>(
            `${environment.apiUrl}${SuggestedItemShoppingListApiService.apiPath}`
        )
        .pipe(
            map((loadSuggestedItemShoppingListDtos: LoadSuggestedItemShoppingListDto[]) => 
            loadSuggestedItemShoppingListDtos.map((loadSuggestedItemShoppingListDto: LoadSuggestedItemShoppingListDto) =>
                SuggestedItemShoppingListConverter.fromDtoToModel(loadSuggestedItemShoppingListDto))
            )
        );
    }
}
