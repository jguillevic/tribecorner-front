import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditEventService } from '../../../service/edit-event.service';
import { MockService } from 'ng-mocks';
import { EventCurrentDateService } from '../../../service/event-current-date.service';
import { RouterTestingModule } from '@angular/router/testing';
import { getTranslocoModule } from '../../../../../transloco-testing.module';
import { EditEventComponent } from './edit-event-page.component';
import { EditEventViewModel } from '../../view-model/edit-event.view-model';

describe('EditEventComponent', () => {
    let fixture: ComponentFixture<EditEventComponent>;
    let component: EditEventComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
            getTranslocoModule(),
            EditEventComponent,
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
  
    it('test createEventForm()', () => {
      const form = component.createEventForm();
  
      expect(form instanceof FormGroup).toBeTruthy();
      expect(form.get(component.nameCode)).toBeDefined();
      expect(form.get(component.startingDateCode)).toBeDefined();
      expect(form.get(component.startingTimeCode)).toBeDefined();
      expect(form.get(component.endingDateCode)).toBeDefined();
      expect(form.get(component.endingTimeCode)).toBeDefined();
      expect(form.get(component.allDayCode)).toBeDefined();
  
      expect(form.get(component.nameCode)?.value).toEqual('');
      expect(form.get(component.startingDateCode)?.value instanceof Date).toBeTruthy();
      expect(form.get(component.startingTimeCode)?.value).toEqual(0);
      expect(form.get(component.endingDateCode)?.value instanceof Date).toBeTruthy();
      expect(form.get(component.endingTimeCode)?.value).toEqual(0);
      expect(form.get(component.allDayCode)?.value).toEqual(false);
  
      // Validators
      expect(form.get(component.nameCode)?.hasError(component.requiredErrorCode)).toBeTruthy();
      expect(form.get(component.nameCode)?.hasError(component.maxLengthErrorCode)).toBeFalsy();
      expect(form.get(component.startingDateCode)?.hasError(component.requiredErrorCode)).toBeFalsy();
      expect(form.get(component.startingTimeCode)?.hasError(component.requiredErrorCode)).toBeFalsy();
      expect(form.get(component.endingDateCode)?.hasError(component.requiredErrorCode)).toBeFalsy();
      expect(form.get(component.endingTimeCode)?.hasError(component.requiredErrorCode)).toBeFalsy();
    });

    it('test updateEditEventForm()', () => {
        const startingDate = new Date(2023, 10, 15);
        const endingDate = new Date(2023, 10, 16);
        const editEventViewModel 
        = new EditEventViewModel(
            0,
            'Test',
            startingDate,
            15,
            endingDate,
            75,
            true
        );

        const editEventForm: FormGroup 
        = component.updateEditEventForm(editEventViewModel);

        expect(editEventForm.get(component.nameCode)).toBeTruthy();
        expect(editEventForm.get(component.nameCode)?.value).toBe('Test');
        expect(editEventForm.get(component.startingDateCode)).toBeTruthy();
        expect(editEventForm.get(component.startingDateCode)?.value.toISOString()).toBe(startingDate.toISOString());
        expect(editEventForm.get(component.startingTimeCode)).toBeTruthy();
        expect(editEventForm.get(component.startingTimeCode)?.value).toBe(15);
        expect(editEventForm.get(component.endingDateCode)).toBeTruthy();
        expect(editEventForm.get(component.endingDateCode)?.value.toISOString()).toBe(endingDate.toISOString());
        expect(editEventForm.get(component.endingTimeCode)).toBeTruthy();
        expect(editEventForm.get(component.endingTimeCode)?.value).toBe(75);
        expect(editEventForm.get(component.allDayCode)).toBeTruthy();
        expect(editEventForm.get(component.allDayCode)?.value).toBe(true);
    });

    it('test getNameErrorMessage()', fakeAsync(() => {
        // Nom vide.
        component.getNameErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('Nom requis');
            }
        );

        // Nom de 256 caractères.
        let editEventViewModel 
        = new EditEventViewModel(
            0,
            'gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
            new Date(),
            15,
            new Date(),
            75,
            true
        );
        component.updateEditEventForm(editEventViewModel);
        component.getNameErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('Nom trop long (max. 255 caractères)');
            }
        );

        // Nom de 255 caractères.
        editEventViewModel 
        = new EditEventViewModel(
            0,
            'ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
            new Date(),
            15,
            new Date(),
            75,
            true
        );
        component.updateEditEventForm(editEventViewModel);
        component.getNameErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );

        flush();
    }));
});