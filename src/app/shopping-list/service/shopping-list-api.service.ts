import { Injectable } from '@angular/core';
import { ShoppingList } from '../model/shopping-list.model';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EditShoppingListDto } from '../dto/edit-shopping-list.dto';
import { LoadShoppingListDto } from '../dto/load-shopping-list.dto';
import { ApiHttpClient } from 'src/app/common/http/api-http-client';
import { ShoppingListConverter } from '../converter/shopping-list.converter';

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
    return this.apiHttp.get<LoadShoppingListDto[]>(
      ShoppingListApiService.getLoadAllRequest(isArchived)
      )
      .pipe(
        map(loadShoppingListDtos => 
          loadShoppingListDtos.map(loadShoppingListDto =>
            ShoppingListConverter.fromDtoToModel(loadShoppingListDto)
          )
        ),
        tap(shoppingList => console.table(shoppingList))
      );
  }

  public loadOneById(shoppingListId: number): Observable<ShoppingList> {
    return this.apiHttp.get<LoadShoppingListDto>(
      `${environment.apiUrl}${ShoppingListApiService.apiPath}/${shoppingListId}`
      )
      .pipe(
        map(
          loadShoppingListDto => 
          ShoppingListConverter.fromDtoToModel(loadShoppingListDto)
        )
      );
  }

  public create(shoppingList: ShoppingList): Observable<ShoppingList> {
    const editShoppingListDto: EditShoppingListDto = ShoppingListConverter.fromModelToDto(shoppingList);
    const body: string = JSON.stringify(editShoppingListDto);

    return this.apiHttp.post<LoadShoppingListDto>(
      `${environment.apiUrl}${ShoppingListApiService.apiPath}`,
      body
      )
      .pipe(
        map(loadShoppingListDto => 
          ShoppingListConverter.fromDtoToModel(loadShoppingListDto)
        )
      );
  }

  public update(shoppingList: ShoppingList): Observable<ShoppingList> {
    const editShoppingListDto: EditShoppingListDto = ShoppingListConverter.fromModelToDto(shoppingList);
    const body: string = JSON.stringify(editShoppingListDto);

    return this.apiHttp.put<LoadShoppingListDto>(
      `${environment.apiUrl}${ShoppingListApiService.apiPath}/${shoppingList.id}`,
      body
      )
      .pipe(
        map(loadShoppingListDto => 
            ShoppingListConverter.fromDtoToModel(loadShoppingListDto)
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