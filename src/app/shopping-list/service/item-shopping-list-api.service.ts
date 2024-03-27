import {Injectable} from '@angular/core';
import {ItemShoppingList} from '../model/item-shopping-list.model';
import {Observable, map} from 'rxjs';
import {ApiHttpClient} from '../../common/http/api-http-client';
import {environment} from '../../../environments/environment';
import {ItemShoppingListConverter} from '../converter/item-shopping-list.converter';
import {ItemShoppingListDto} from '../dto/item-shopping-list.dto';

@Injectable({
  providedIn: 'root',
})
export class ItemShoppingListApiService {
    private static apiPath: string = "item_shopping_lists";

    public constructor(
        private readonly apiHttp: ApiHttpClient
    ) { }

    public loadOneById(itemShoppingListId: number): Observable<ItemShoppingList> {
        return this.apiHttp.get<ItemShoppingListDto>(
            `${environment.apiUrl}${ItemShoppingListApiService.apiPath}/${itemShoppingListId}`
        )
        .pipe(
            map(itemShoppingListDto => 
                ItemShoppingListConverter.fromDtoToModel(itemShoppingListDto)
            )
        );
    }

    public create(itemShoppingList: ItemShoppingList): Observable<ItemShoppingList> {
        const editItemShoppingListDto: ItemShoppingListDto = ItemShoppingListConverter.fromModelToDto(itemShoppingList);
        const body: string = JSON.stringify(editItemShoppingListDto);
    
        return this.apiHttp.post<ItemShoppingListDto>(
          `${environment.apiUrl}${ItemShoppingListApiService.apiPath}`,
          body
          )
          .pipe(
            map(itemShoppingListDto => 
              ItemShoppingListConverter.fromDtoToModel(itemShoppingListDto)
            )
          );
      }

    public upate(itemShoppingList: ItemShoppingList): Observable<ItemShoppingList> {
        const itemShoppingListDto: ItemShoppingListDto 
        = ItemShoppingListConverter.fromModelToDto(itemShoppingList);
        const body: string = JSON.stringify(itemShoppingListDto);

        return this.apiHttp.put<ItemShoppingListDto>(
            `${environment.apiUrl}${ItemShoppingListApiService.apiPath}/${itemShoppingList.id}`,
            body
        )
        .pipe(
            map(itemShoppingListDto => 
                ItemShoppingListConverter.fromDtoToModel(itemShoppingListDto)
            )
        );
    }

    public delete(itemShoppingListId: number): Observable<void> {
        return this.apiHttp.delete<void>(
          `${environment.apiUrl}${ItemShoppingListApiService.apiPath}/${itemShoppingListId}`
          );
      }
}
