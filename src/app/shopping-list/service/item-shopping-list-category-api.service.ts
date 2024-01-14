import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { ItemShoppingListCategory } from '../model/item-shopping-list-category.model';
import { ApiHttpClient } from '../../common/http/api-http-client';
import { environment } from '../../../environments/environment';
import { ItemShoppingListCategoryDto } from '../dto/item-shopping-list-category.dto';
import { ItemShoppingListCategoryConverter } from '../converter/item-shopping-list-category.converter';

@Injectable()
export class ItemShoppingListCategoryApiService {
    private static apiPath: string = "item_shopping_list_categories";

    public allItemShoppingListCategories$: Observable<ItemShoppingListCategory[]> 
    = this.loadAll()
    .pipe(
        shareReplay(1)
    );

    public constructor(
        private readonly apiHttp: ApiHttpClient
    ) { }

    public loadAll(): Observable<ItemShoppingListCategory[]> {
        return this.apiHttp.get<ItemShoppingListCategoryDto[]>(
            `${environment.apiUrl}${ItemShoppingListCategoryApiService.apiPath}`
        )
        .pipe(
            map((loadItemShoppingListCategoryDtos: ItemShoppingListCategoryDto[]) => 
            loadItemShoppingListCategoryDtos.map((loadItemShoppingListCategoryDto: ItemShoppingListCategoryDto) =>
                ItemShoppingListCategoryConverter.fromDtoToModel(loadItemShoppingListCategoryDto))
            )
        );
    }
}
