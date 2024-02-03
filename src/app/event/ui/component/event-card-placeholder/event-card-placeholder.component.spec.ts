import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardPlaceholderComponent } from './event-card-placeholder.component';

describe('EventCardPlaceholderComponent', () => {
  let component: EventCardPlaceholderComponent;
  let fixture: ComponentFixture<EventCardPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardPlaceholderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventCardPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
