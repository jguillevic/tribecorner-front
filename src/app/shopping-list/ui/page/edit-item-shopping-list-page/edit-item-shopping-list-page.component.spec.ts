import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemShoppingListPageComponent } from './edit-item-shopping-list-page.component';

describe('EditItemShoppingListPageComponent', () => {
  let component: EditItemShoppingListPageComponent;
  let fixture: ComponentFixture<EditItemShoppingListPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditItemShoppingListPageComponent]
    });
    fixture = TestBed.createComponent(EditItemShoppingListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
