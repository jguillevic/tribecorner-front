import { TestBed } from '@angular/core/testing';

import { ItemShoppingListGoToService } from './item-shopping-list-go-to.service';

describe('ItemShoppingListGoToService', () => {
  let service: ItemShoppingListGoToService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemShoppingListGoToService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
