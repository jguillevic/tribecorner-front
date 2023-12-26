import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditEventService } from '../../../service/edit-event.service';
import { MockService } from 'ng-mocks';
import { EventCurrentDateService } from '../../../service/event-current-date.service';
import { RouterTestingModule } from '@angular/router/testing';
import { getTranslocoModule } from '../../../../../transloco-testing.module';
import { EditEventComponent } from './edit-event-page.component';
import { EditEventViewModel } from '../../view-model/edit-event.view-model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventService } from '../../../service/event.service';
import { EventTimeHelper } from '../../../helper/event-time.helper';

describe('EditEventComponent', () => {
    let fixture: ComponentFixture<EditEventComponent>;
    let component: EditEventComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
            RouterTestingModule,
            getTranslocoModule(),
            EditEventComponent,
            BrowserAnimationsModule
        ],
        providers: [
            EditEventService,
            { 
                provide: EventService, useValue: MockService(EventService) 
            },
            ReactiveFormsModule,
            EventCurrentDateService
        ]
      });
  
      fixture = TestBed.createComponent(EditEventComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
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
    });

    it('test updateEditEventForm()', () => {
        const startingDate = new Date(2023, 10, 15);
        const endingDate = new Date(2023, 10, 16);
        const editEventViewModel 
        = new EditEventViewModel(
            0,
            'Test',
            startingDate,
            0,
            endingDate,
            0,
            true
        );

        const editEventForm: FormGroup 
        = component.updateEditEventForm(editEventViewModel);

        expect(editEventForm.get(component.nameCode)).toBeTruthy();
        expect(editEventForm.get(component.nameCode)?.value).toBe('Test');
        expect(editEventForm.get(component.startingDateCode)).toBeTruthy();
        expect(editEventForm.get(component.startingDateCode)?.value.toISOString()).toBe(startingDate.toISOString());
        expect(editEventForm.get(component.startingTimeCode)).toBeTruthy();
        expect(editEventForm.get(component.startingTimeCode)?.value).toBe(0);
        expect(editEventForm.get(component.endingDateCode)).toBeTruthy();
        expect(editEventForm.get(component.endingDateCode)?.value.toISOString()).toBe(endingDate.toISOString());
        expect(editEventForm.get(component.endingTimeCode)).toBeTruthy();
        expect(editEventForm.get(component.endingTimeCode)?.value).toBe(0);
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
        component.updateNameControl('gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg');
        component.getNameErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('Nom trop long (max. 255 caractères)');
            }
        );

        // Nom de 255 caractères.
        component.updateNameControl('ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg');
        component.getNameErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );

        flush();
    }));

    it('test getStartingDateErrorMessage()', fakeAsync(() => {
        // Renseignement du nom pour ne pas avoir d'impact de cette erreur
        // dans le reste du test.
        component.updateNameControl('Test');

        // Date de début renseignée par défaut.
        component.getStartingDateErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );
        expect(component.editEventForm.valid).toBeTruthy();

        // Date et heure de début > Date et heure de fin et pas un événement durant toute la journée.
        const endingDate: Date = component.getEndingDateControl().value;
        const oldStartingDate: Date = component.getStartingDateControl().value;
        const newStartingDate: Date = new Date(endingDate);
        newStartingDate.setDate(newStartingDate.getDate() + 1);
        component.updateStartingDateControl(newStartingDate);
        component.getStartingDateErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('La date et l\'heure de début doivent être < à la date et l\'heure de fin');
            }
        );
        expect(component.editEventForm.valid).toBeFalsy();

        // Date de début de nouveau cohérente, le message d'erreur doit être supprimé.
        component.updateStartingDateControl(oldStartingDate);
        component.getStartingDateErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );
        expect(component.editEventForm.valid).toBeTruthy();

        // Date de début > Date de fin et un événement durant toute la journée.
        component.updateAllDayControl(true);
        component.updateStartingDateControl(newStartingDate);
        component.getStartingDateErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('La date de début doit être < à la date de fin');
            }
        );
        expect(component.editEventForm.valid).toBeFalsy();

        // Date et heure de début de nouveau cohérente, le message d'erreur doit être supprimé.
        component.updateStartingDateControl(oldStartingDate);
        component.getStartingDateErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );
        expect(component.editEventForm.valid).toBeTruthy();

        // Date de début vidée.
        component.updateStartingDateControl(undefined);
        component.getStartingDateErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('Date de début requise');
            }
        );
        expect(component.editEventForm.valid).toBeFalsy();

        flush();
    }));

    it ('test getStartingTimeErrorMessage()', fakeAsync(() => {
        // Renseignement du nom pour ne pas avoir d'impact de cette erreur
        // dans le reste du test.
        component.updateNameControl('Test');

        // Heure de début renseignée par défaut.
        component.getStartingTimeErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );
        expect(component.editEventForm.valid).toBeTruthy();

        // Date et heure de début > Date et heure de fin et pas un événement durant toute la journée.
        const endingTime: number = component.getEndingTimeControl().value;
        const oldStartingTime: number = component.getStartingTimeControl().value;
        let newStartingTime: number = endingTime;
        component.updateStartingTimeControl(newStartingTime);
        component.getStartingTimeErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('La date et l\'heure de début doivent être < à la date et l\'heure de fin');
            }
        );
        expect(component.editEventForm.valid).toBeFalsy();

        // Passage en toute la journée, le message doit être supprimée.
        component.updateAllDayControl(true);
        component.getStartingTimeErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );
        expect(component.editEventForm.valid).toBeTruthy();
        component.updateAllDayControl(false);

        newStartingTime += 15;
        component.updateStartingTimeControl(newStartingTime);
        component.getStartingTimeErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('La date et l\'heure de début doivent être < à la date et l\'heure de fin');
            }
        );
        expect(component.editEventForm.valid).toBeFalsy();

        // Date et heure de début de nouveau cohérente, le message d'erreur doit être supprimé.
        component.updateStartingTimeControl(oldStartingTime);
        component.getStartingTimeErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );
        expect(component.editEventForm.valid).toBeTruthy();

        // Heure de début vidée.
        component.updateStartingTimeControl(undefined);
        component.getStartingTimeErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('Heure de début requise');
            }
        );
        expect(component.editEventForm.valid).toBeFalsy();

        flush();
    }));

    it('test getEndingDateErrorMessage()', fakeAsync(() => {
        // Renseignement du nom pour ne pas avoir d'impact de cette erreur
        // dans le reste du test.
        component.updateNameControl('Test');

        // Date de fin renseignée par défaut.
        component.getEndingDateErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );
        expect(component.editEventForm.valid).toBeTruthy();

        // Date et heure de fin < Date et heure de début et pas un événement durant toute la journée.
        const startingDate: Date = component.getStartingDateControl().value;
        const oldEndingDate: Date = component.getEndingDateControl().value;
        const newEndingDate: Date = new Date(startingDate);
        newEndingDate.setDate(newEndingDate.getDate() - 1);
        component.updateEndingDateControl(newEndingDate);
        component.getEndingDateErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('La date et l\'heure de fin doivent être > à la date et l\'heure de début');
            }
        );
        expect(component.editEventForm.valid).toBeFalsy();

        // Date de fin de nouveau cohérente, le message d'erreur doit être supprimé.
        component.updateEndingDateControl(oldEndingDate);
        component.getEndingDateErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );
        expect(component.editEventForm.valid).toBeTruthy();

        // Date de fin < Date de début et un événement durant toute la journée.
        component.updateAllDayControl(true);
        component.updateEndingDateControl(newEndingDate);
        component.getEndingDateErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('La date de fin doit être > à la date de début');
            }
        );
        expect(component.editEventForm.valid).toBeFalsy();

        // Date et heure de fin de nouveau cohérente, le message d'erreur doit être supprimé.
        component.updateEndingDateControl(oldEndingDate);
        component.getEndingDateErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );
        expect(component.editEventForm.valid).toBeTruthy();

        //      
        component.updateEndingDateControl(newEndingDate);
        component.updateAllDayControl(true);
        component.getEndingDateErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );
        component.getStartingDateErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('La date de début doit être < à la date de fin');
            }
        );
        expect(component.editEventForm.valid).toBeFalsy();

        // Date de fin vidée.
        component.updateEndingDateControl(undefined);
        component.getEndingDateErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('Date de fin requise');
            }
        );
        expect(component.editEventForm.valid).toBeFalsy();

        flush();
    }));

    it ('test getEndingTimeErrorMessage()', fakeAsync(() => {
        // Renseignement du nom pour ne pas avoir d'impact de cette erreur
        // dans le reste du test.
        component.updateNameControl('Test');

        // Heure de fin renseignée par défaut.
        component.getEndingTimeErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );
        expect(component.editEventForm.valid).toBeTruthy();

        // Date et heure de fin < Date et heure de début et pas un événement durant toute la journée.
        const startingTime: number = component.getStartingTimeControl().value;
        const oldEndingTime: number = component.getEndingTimeControl().value;
        let newEndingTime: number = startingTime;
        component.updateEndingTimeControl(newEndingTime);
        component.getEndingTimeErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('La date et l\'heure de fin doivent être > à la date et l\'heure de début');
            }
        );
        expect(component.editEventForm.valid).toBeFalsy();

        // Passage en toute la journée, le message doit être supprimée.
        component.updateAllDayControl(true);
        component.getEndingTimeErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );
        expect(component.editEventForm.valid).toBeTruthy();
        component.updateAllDayControl(false);

        newEndingTime -= 15;
        component.updateEndingTimeControl(newEndingTime);
        component.getEndingTimeErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('La date et l\'heure de fin doivent être > à la date et l\'heure de début');
            }
        );
        expect(component.editEventForm.valid).toBeFalsy();

        // Date et heure de fin de nouveau cohérente, le message d'erreur doit être supprimé.
        component.updateEndingTimeControl(oldEndingTime);
        component.getEndingTimeErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe(undefined);
            }
        );
        expect(component.editEventForm.valid).toBeTruthy();

        // Heure de fin vidée.
        component.updateEndingTimeControl(undefined);
        component.getEndingTimeErrorMessage()
        .subscribe(
            (message: string|undefined) => {
                expect(message).toBe('Heure de fin requise');
            }
        );
        expect(component.editEventForm.valid).toBeFalsy();

        flush();
    }));

    it ('test on time controls when allDay component changes value', fakeAsync(() => {
        // Par défaut, les composants de saisie des temps sont activés.
        expect(component.getStartingTimeControl().enabled).toBeTruthy();
        expect(component.getStartingTimeControl().value).toBe(EventTimeHelper.getDefaultStartingTime());
        expect(component.getEndingTimeControl().enabled).toBeTruthy();
        expect(component.getEndingTimeControl().value).toBe(EventTimeHelper.getDefaultEndingTime());

        // Quand événement toute la journée, les composants de saisie des temps sont désactivés.
        component.updateAllDayControl(true);
        expect(component.getStartingTimeControl().disabled).toBeTruthy();
        expect(component.getStartingTimeControl().value).toBe(0);
        expect(component.getEndingTimeControl().disabled).toBeTruthy();
        expect(component.getEndingTimeControl().value).toBe(0);

        // Suite au changement de la valeur du composant toute la journée,
        // les composants dde saisie des temps sont à nouveau activés.
        component.updateAllDayControl(false);
        expect(component.getStartingTimeControl().enabled).toBeTruthy();
        expect(component.getStartingTimeControl().value).toBe(EventTimeHelper.getDefaultStartingTime());
        expect(component.getEndingTimeControl().enabled).toBeTruthy();
        expect(component.getEndingTimeControl().value).toBe(EventTimeHelper.getDefaultEndingTime());

        flush();
    }));
});