import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckableItemShoppingListsComponent } from './checkable-item-shopping-lists.component';

describe('CheckableItemShoppingListsComponent', () => {
  let component: CheckableItemShoppingListsComponent;
  let fixture: ComponentFixture<CheckableItemShoppingListsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CheckableItemShoppingListsComponent]
    });
    fixture = TestBed.createComponent(CheckableItemShoppingListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
