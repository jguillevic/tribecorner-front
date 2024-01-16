import {Injectable} from '@angular/core';
import {ShoppingList} from '../model/shopping-list.model';
import {Observable, map} from 'rxjs';
import {environment} from 'src/environments/environment';
import {ShoppingListDto} from '../dto/shopping-list.dto';
import {ApiHttpClient} from 'src/app/common/http/api-http-client';
import {ShoppingListConverter} from '../converter/shopping-list.converter';

@Injectable()
export class ShoppingListApiService {
  private static apiPath: string = "shopping_lists";

  public constructor(
    private readonly apiHttp: ApiHttpClient
  ) { }

  public static getLoadAllRequest(isArchived: boolean|undefined = undefined): string {
    let isArchivedParameter: string = '';
    if (isArchived !== undefined) {
      isArchivedParameter = `?isArchived=${isArchived}`;
    }
    const request: string = `${environment.apiUrl}${ShoppingListApiService.apiPath}${isArchivedParameter}`;

    return request;
  }

  public loadAll(isArchived: boolean|undefined = undefined): Observable<ShoppingList[]> {
    return this.apiHttp.get<ShoppingListDto[]>(
      ShoppingListApiService.getLoadAllRequest(isArchived)
      )
      .pipe(
        map(shoppingListDtos => 
          shoppingListDtos.map(shoppingListDto =>
            ShoppingListConverter.fromDtoToModel(shoppingListDto)
          )
        )
      );
  }

  public loadOneById(shoppingListId: number): Observable<ShoppingList> {
    return this.apiHttp.get<ShoppingListDto>(
      `${environment.apiUrl}${ShoppingListApiService.apiPath}/${shoppingListId}`
      )
      .pipe(
        map(
          shoppingListDto => 
          ShoppingListConverter.fromDtoToModel(shoppingListDto)
        )
      );
  }

  public create(shoppingList: ShoppingList): Observable<ShoppingList> {
    const editShoppingListDto: ShoppingListDto = ShoppingListConverter.fromModelToDto(shoppingList);
    const body: string = JSON.stringify(editShoppingListDto);

    return this.apiHttp.post<ShoppingListDto>(
      `${environment.apiUrl}${ShoppingListApiService.apiPath}`,
      body
      )
      .pipe(
        map(shoppingListDto => 
          ShoppingListConverter.fromDtoToModel(shoppingListDto)
        )
      );
  }

  public update(shoppingList: ShoppingList): Observable<ShoppingList> {
    const shoppingListDto: ShoppingListDto = ShoppingListConverter.fromModelToDto(shoppingList);
    const body: string = JSON.stringify(shoppingListDto);

    return this.apiHttp.put<ShoppingListDto>(
      `${environment.apiUrl}${ShoppingListApiService.apiPath}/${shoppingList.id}`,
      body
      )
      .pipe(
        map(shoppingListDto => 
            ShoppingListConverter.fromDtoToModel(shoppingListDto)
        )
      );
  }

  public delete(shoppingListId: number): Observable<void> {
    return this.apiHttp.delete<void>(
      `${environment.apiUrl}${ShoppingListApiService.apiPath}/${shoppingListId}`
      );
  }

  public toggleArchive(shoppingList: ShoppingList): Observable<ShoppingList> {
    shoppingList.isArchived = !shoppingList.isArchived;
    return this.update(shoppingList);
  }
}