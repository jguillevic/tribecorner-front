import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditEventComponent } from './edit-event-page.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditEventService } from '../../../service/edit-event.service';
import { MockService } from 'ng-mocks';
import { EventCurrentDateService } from '../../../service/event-current-date.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoTestingModule } from '@ngneat/transloco';

describe('EditEventComponent', () => {
    let fixture: ComponentFixture<EditEventComponent>;
    let component: EditEventComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
            EditEventComponent,
            RouterTestingModule,
            TranslocoTestingModule
        ],
        providers: [
            { 
                provide: EditEventService, useValue: MockService(EditEventService) 
            },
            ReactiveFormsModule,
            EventCurrentDateService
        ]
      });
  
      fixture = TestBed.createComponent(EditEventComponent);
      component = fixture.componentInstance;
    });
  
    it('should create an event form with default values', () => {
      const form = component.createEventForm();
  
      expect(form instanceof FormGroup).toBeTruthy();
      expect(form.get('name')).toBeDefined();
      expect(form.get('startingDate')).toBeDefined();
      expect(form.get('startingTime')).toBeDefined();
      expect(form.get('endingDate')).toBeDefined();
      expect(form.get('endingTime')).toBeDefined();
      expect(form.get('allDay')).toBeDefined();
  
      expect(form.get('name')?.value).toEqual('');
      expect(form.get('startingDate')?.value instanceof Date).toBeTruthy();
      expect(form.get('startingTime')?.value).toEqual(0);
      expect(form.get('endingDate')?.value instanceof Date).toBeTruthy();
      expect(form.get('endingTime')?.value).toEqual(0);
      expect(form.get('allDay')?.value).toEqual(false);
  
      // Validators
      expect(form.get('name')?.hasError('required')).toBeTruthy();
      expect(form.get('name')?.hasError('maxlength')).toBeFalsy();
      expect(form.get('startingDate')?.hasError('required')).toBeFalsy();
      expect(form.get('startingTime')?.hasError('required')).toBeFalsy();
      expect(form.get('endingDate')?.hasError('required')).toBeFalsy();
      expect(form.get('endingTime')?.hasError('required')).toBeFalsy();
    });
});