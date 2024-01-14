import { TestBed } from '@angular/core/testing';

import { ItemShoppingListCategoryApiService } from './item-shopping-list-category-api.service';

describe('ItemShoppingListCategoryApiService', () => {
  let service: ItemShoppingListCategoryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemShoppingListCategoryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
