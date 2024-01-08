import { Injectable } from '@angular/core';
import { ItemShoppingList } from '../model/item-shopping-list.model';
import { Observable, map, of } from 'rxjs';
import { ApiHttpClient } from '../../common/http/api-http-client';
import { environment } from '../../../environments/environment';
import { ItemShoppingListConverter } from '../converter/item-shopping-list.converter';
import { LoadItemShoppingListDto } from '../dto/load-item-shopping-list.dto';
import { EditItemShoppingListDto } from '../dto/edit-item-shopping-list.dto';

@Injectable()
export class ItemShoppingListApiService {
    private static apiPath: string = "item_shopping_lists";

    public constructor(
        private apiHttp: ApiHttpClient
    ) { }

    public loadOneById(itemShoppingListId: number): Observable<ItemShoppingList> {
        return this.apiHttp.get<LoadItemShoppingListDto>(
            `${environment.apiUrl}${ItemShoppingListApiService.apiPath}/${itemShoppingListId}`
        )
        .pipe(
            map(loadItemShoppingListDto => 
                ItemShoppingListConverter.fromDtoToModel(loadItemShoppingListDto)
            )
        );
    }

    public upate(itemShoppingList: ItemShoppingList): Observable<ItemShoppingList> {
        const editItemShoppingListDto: EditItemShoppingListDto 
        = ItemShoppingListConverter.fromModelToDto(itemShoppingList);
        const body: string = JSON.stringify(editItemShoppingListDto);

        return this.apiHttp.put<LoadItemShoppingListDto>(
            `${environment.apiUrl}${ItemShoppingListApiService.apiPath}/${itemShoppingList.id}`,
            body
        )
        .pipe(
            map(loadItemShoppingListDto => 
                ItemShoppingListConverter.fromDtoToModel(loadItemShoppingListDto)
            )
        );
    }
}
