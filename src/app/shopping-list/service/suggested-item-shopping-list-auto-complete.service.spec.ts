import { TestBed } from '@angular/core/testing';

import { SuggestedItemShoppingListAutoCompleteService } from './suggested-item-shopping-list-auto-complete.service';

describe('SuggestedItemShoppingListAutoCompleteService', () => {
  let service: SuggestedItemShoppingListAutoCompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuggestedItemShoppingListAutoCompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
