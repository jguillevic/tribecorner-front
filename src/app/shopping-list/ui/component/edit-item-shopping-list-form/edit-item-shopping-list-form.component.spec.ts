import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemShoppingListFormComponent } from './edit-item-shopping-list-form.component';

describe('EditItemShoppingListFormComponent', () => {
  let component: EditItemShoppingListFormComponent;
  let fixture: ComponentFixture<EditItemShoppingListFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditItemShoppingListFormComponent]
    });
    fixture = TestBed.createComponent(EditItemShoppingListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
