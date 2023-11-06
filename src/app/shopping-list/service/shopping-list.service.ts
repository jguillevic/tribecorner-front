import { Injectable } from '@angular/core';
import { ShoppingList } from '../model/shopping-list.model';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EditItemShoppingListDto } from '../dto/edit-item-shopping-list.dto';
import { EditShoppingListDto } from '../dto/edit-shopping-list.dto';
import { ItemShoppingList } from '../model/item-shopping-list.model';
import { LoadShoppingListDto } from '../dto/load-shopping-list.dto';
import { LoadItemShoppingListDto } from '../dto/load-item-shopping-list.dto';
import { ApiHttpClient } from 'src/app/common/http/api-http-client';

@Injectable()
export class ShoppingListService {
  private static apiPath: string = "shopping_lists";

  constructor(private apiHttp: ApiHttpClient) { }

  public loadAll(): Observable<ShoppingList[]> {
    return this.apiHttp.get<LoadShoppingListDto[]>(
      `${environment.apiUrl}${ShoppingListService.apiPath}`
      )
      .pipe(
        map(loadShoppingListDtos => 
          loadShoppingListDtos.map(loadShoppingListDto =>
            ShoppingListService.fromLoadShoppingListDtoToShoppingList(loadShoppingListDto)
          )
        ),
        tap(shoppingLists => console.table(shoppingLists))
      );
  }

  public loadOneById(shoppingListId: number): Observable<ShoppingList> {
    return this.apiHttp.get<LoadShoppingListDto>(
      `${environment.apiUrl}${ShoppingListService.apiPath}/${shoppingListId}`
      )
      .pipe(
        map(
          loadShoppingListDto => 
          ShoppingListService.fromLoadShoppingListDtoToShoppingList(loadShoppingListDto)
        ),
        tap(shoppingList => console.table(shoppingList))
      );
  }

  public create(shoppingList: ShoppingList): Observable<ShoppingList> {
    const editShoppingListDto = ShoppingListService.fromShoppingListToEditShoppingListDto(shoppingList);
    const body: string = JSON.stringify(editShoppingListDto);

    return this.apiHttp.post<LoadShoppingListDto>(
      `${environment.apiUrl}${ShoppingListService.apiPath}`,
      body
      )
      .pipe(
        map(loadShoppingListDto => 
            ShoppingListService.fromLoadShoppingListDtoToShoppingList(loadShoppingListDto)
        ),
        tap(shoppingList => console.table(shoppingList))
      );
  }

  public update(shoppingList: ShoppingList): Observable<ShoppingList> {
    const editShoppingListDto = ShoppingListService.fromShoppingListToEditShoppingListDto(shoppingList);
    const body: string = JSON.stringify(editShoppingListDto);

    return this.apiHttp.put<LoadShoppingListDto>(
      `${environment.apiUrl}${ShoppingListService.apiPath}/${shoppingList.id}`,
      body
      )
      .pipe(
        map(loadShoppingListDto => 
            ShoppingListService.fromLoadShoppingListDtoToShoppingList(loadShoppingListDto)
        ),
        tap(shoppingList => console.table(shoppingList))
      );
  }

  public delete(shoppingListId: number): Observable<void> {
    return this.apiHttp.delete<void>(
      `${environment.apiUrl}${ShoppingListService.apiPath}/${shoppingListId}`
      );
  }

  private static fromShoppingListToEditShoppingListDto(shoppingList: ShoppingList): EditShoppingListDto {
    const editShoppingListDto = new EditShoppingListDto();

    editShoppingListDto.id = shoppingList.id;
    editShoppingListDto.name = shoppingList.name;
    editShoppingListDto.isArchived = shoppingList.isArchived;

    shoppingList.items.forEach(itemShoppingList => {
      const editItemShoppingListDto = ShoppingListService.fromItemShoppingListToEditItemShoppingListDto(itemShoppingList);
      editShoppingListDto.items.push(editItemShoppingListDto);
    });

    return editShoppingListDto;
  }

  private static fromItemShoppingListToEditItemShoppingListDto(itemShoppingList: ItemShoppingList): EditItemShoppingListDto {
    const editItemShoppingListDto = new EditItemShoppingListDto();

    editItemShoppingListDto.id = itemShoppingList.id;
    editItemShoppingListDto.name = itemShoppingList.name;
    editItemShoppingListDto.isChecked = itemShoppingList.isChecked;
    editItemShoppingListDto.position = itemShoppingList.position;

    return editItemShoppingListDto;
  }

  private static fromLoadShoppingListDtoToShoppingList(loadShoppingListDto: LoadShoppingListDto): ShoppingList {
    const shoppingList = new ShoppingList();

    shoppingList.id = loadShoppingListDto.id;
    shoppingList.name = loadShoppingListDto.name;
    shoppingList.isArchived = loadShoppingListDto.isArchived;

    loadShoppingListDto.items.forEach(loadItemShoppingListDto => {
      const itemShoppingList = ShoppingListService.fromLoadItemShoppingListDtoToItemShoppingList(loadItemShoppingListDto);
      shoppingList.items.push(itemShoppingList);
    });

    return shoppingList;
  }

  private static fromLoadItemShoppingListDtoToItemShoppingList(loadItemShoppingListDto: LoadItemShoppingListDto): ItemShoppingList {
    const itemShoppingList: ItemShoppingList = new ItemShoppingList();

    itemShoppingList.id = loadItemShoppingListDto.id;
    itemShoppingList.name = loadItemShoppingListDto.name;
    itemShoppingList.isChecked = loadItemShoppingListDto.isChecked;
    itemShoppingList.position = loadItemShoppingListDto.position;

    return itemShoppingList;
  }
}