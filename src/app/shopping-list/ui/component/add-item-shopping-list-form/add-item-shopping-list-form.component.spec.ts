import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemShoppingListFormComponent } from './add-item-shopping-list-form.component';

describe('AddItemShoppingListFormComponent', () => {
  let component: AddItemShoppingListFormComponent;
  let fixture: ComponentFixture<AddItemShoppingListFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddItemShoppingListFormComponent]
    });
    fixture = TestBed.createComponent(AddItemShoppingListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
