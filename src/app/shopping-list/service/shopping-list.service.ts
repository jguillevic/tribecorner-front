import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ShoppingList } from '../model/shopping-list.model';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EditItemShoppingListDto } from '../dto/edit-item-shopping-list.dto';
import { EditShoppingListDto } from '../dto/edit-shopping-list.dto';
import { ItemShoppingList } from '../model/item-shopping-list.model';
import { LoadShoppingListDto } from '../dto/load-shopping-list.dto';
import { LoadItemShoppingListDto } from '../dto/load-item-shopping-list.dto';

@Injectable()
export class ShoppingListService {
  private static apiPath: string = "shopping_lists";

  constructor(private http: HttpClient) { }

  public loadAllByFamilyId(familyId: number, count: number = 20): Observable<ShoppingList[]> {
    const headers: HttpHeaders= new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    return this.http.get<LoadShoppingListDto[]>(
      `${environment.apiUrl}${ShoppingListService.apiPath}?family=${familyId}&itemsPerPage=${count}`,
      { 'headers': headers }
      )
      .pipe(
        switchMap((loadShoppingListDtos) => {
          const shoppingLists: ShoppingList[] = [];
          loadShoppingListDtos.forEach(loadShoppingListDto => {
            const shoppingList: ShoppingList = ShoppingListService.fromLoadShoppingListDtoToShoppingList(loadShoppingListDto);
            shoppingLists.push(shoppingList);
          });
          return of(shoppingLists);
        })
      );
  }

  public loadOneById(shoppingListId: number): Observable<ShoppingList> {
    const headers: HttpHeaders= new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    return this.http.get<LoadShoppingListDto>(
      `${environment.apiUrl}${ShoppingListService.apiPath}/${shoppingListId}`,
      { 'headers': headers }
      )
      .pipe(
        switchMap((loadShoppingListDto) => {
          const shoppingList: ShoppingList = ShoppingListService.fromLoadShoppingListDtoToShoppingList(loadShoppingListDto);
          return of(shoppingList);
        })
      );
  }

  public create(shoppingList: ShoppingList): Observable<ShoppingList|undefined> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    const editShoppingListDto = ShoppingListService.fromShoppingListToEditShoppingListDto(shoppingList);
    const body: string = JSON.stringify(editShoppingListDto);

    return this.http.post<LoadShoppingListDto>(
      `${environment.apiUrl}${ShoppingListService.apiPath}`,
      body, 
      { 'headers': headers }
      )
      .pipe(
        switchMap((loadShoppingListDto) => {
            return of(ShoppingListService.fromLoadShoppingListDtoToShoppingList(loadShoppingListDto));
        })
      );
  }

  public update(shoppingList: ShoppingList): Observable<ShoppingList|undefined> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    const editShoppingListDto = ShoppingListService.fromShoppingListToEditShoppingListDto(shoppingList);
    const body: string = JSON.stringify(editShoppingListDto);

    return this.http.put<LoadShoppingListDto>(
      `${environment.apiUrl}${ShoppingListService.apiPath}/${shoppingList.id}`,
      body, 
      { 'headers': headers }
      )
      .pipe(
        switchMap((loadShoppingListDto) => {
            return of(ShoppingListService.fromLoadShoppingListDtoToShoppingList(loadShoppingListDto));
        })
      );
  }

  public delete(shoppingListId: number): Observable<void> {
    const headers: HttpHeaders= new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    return this.http.delete<void>(
      `${environment.apiUrl}${ShoppingListService.apiPath}/${shoppingListId}`,
      { 'headers': headers }
      );
  }

  private static fromShoppingListToEditShoppingListDto(shoppingList: ShoppingList): EditShoppingListDto {
    const editShoppingListDto = new EditShoppingListDto();

    editShoppingListDto.id = shoppingList.id;
    editShoppingListDto.name = shoppingList.name;
    editShoppingListDto.familyId = shoppingList.familyId;

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
    shoppingList.familyId = loadShoppingListDto.familyId;

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