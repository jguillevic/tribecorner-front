import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListEditButtonComponent } from './shopping-list-edit-button.component';

describe('ShoppingListEditButtonComponent', () => {
  let component: ShoppingListEditButtonComponent;
  let fixture: ComponentFixture<ShoppingListEditButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShoppingListEditButtonComponent]
    });
    fixture = TestBed.createComponent(ShoppingListEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
