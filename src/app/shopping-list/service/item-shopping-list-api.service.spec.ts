import { TestBed } from '@angular/core/testing';

import { ItemShoppingListApiService } from './item-shopping-list-api.service';

describe('ItemShoppingListApiService', () => {
  let service: ItemShoppingListApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemShoppingListApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
