import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShoppingListFormComponent } from './edit-shopping-list-form.component';

describe('EditShoppingListFormComponent', () => {
  let component: EditShoppingListFormComponent;
  let fixture: ComponentFixture<EditShoppingListFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditShoppingListFormComponent]
    });
    fixture = TestBed.createComponent(EditShoppingListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
