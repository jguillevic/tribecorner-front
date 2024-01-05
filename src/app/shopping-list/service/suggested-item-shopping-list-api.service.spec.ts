import { TestBed } from '@angular/core/testing';

import { SuggestedItemShoppingListApiService } from './suggested-item-shopping-list-api.service';

describe('SuggestedItemShoppingListApiService', () => {
  let service: SuggestedItemShoppingListApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuggestedItemShoppingListApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
