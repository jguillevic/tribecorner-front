import {Injectable} from '@angular/core';
import {Observable, map, shareReplay} from 'rxjs';
import {ItemShoppingListCategory} from '../model/item-shopping-list-category.model';
import {ApiHttpClient} from '../../common/http/api-http-client';
import {environment} from '../../../environments/environment';
import {ItemShoppingListCategoryDto} from '../dto/item-shopping-list-category.dto';
import {ItemShoppingListCategoryConverter} from '../converter/item-shopping-list-category.converter';
import {ItemShoppingListCategoryHelper} from '../helper/item-shopping-list-category.helper';

@Injectable({
    providedIn: 'root',
})
export class ItemShoppingListCategoryApiService {
    private static apiPath: string = "item_shopping_list_categories";

    public readonly categories$: Observable<ItemShoppingListCategory[]> 
    = this.loadAll()
    .pipe(
        shareReplay(1)
    );

    public readonly defaultCategory$: Observable<ItemShoppingListCategory|undefined>
    = this.categories$
    .pipe(
        map(categories => categories.find(category => category.code === ItemShoppingListCategoryHelper.unknownCode))
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
                loadItemShoppingListCategoryDtos
                .map((loadItemShoppingListCategoryDto: ItemShoppingListCategoryDto) =>
                    ItemShoppingListCategoryConverter.fromDtoToModel(loadItemShoppingListCategoryDto)
                )
                .sort((a, b) => ItemShoppingListCategoryHelper.compare(a, b))
            )
        );
    }
}
