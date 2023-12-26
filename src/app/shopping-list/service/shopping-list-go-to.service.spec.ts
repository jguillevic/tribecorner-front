import { TestBed } from '@angular/core/testing';

import { ShoppingListGoToService } from './shopping-list-go-to.service';

describe('ShoppingListGoToService', () => {
  let service: ShoppingListGoToService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingListGoToService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
