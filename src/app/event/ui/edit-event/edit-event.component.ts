import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoBackTopBarComponent } from "../../../common/top-bar/go-back/ui/go-back-top-bar.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Event } from '../../model/event.model';
import {
    MtxCalendarView,
    MtxDatetimepickerMode,
    MtxDatetimepickerType,
  } from '@ng-matero/extensions/datetimepicker';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MtxNativeDatetimeModule } from '@ng-matero/extensions/core';
import { MTX_DATETIME_FORMATS } from '@ng-matero/extensions/core';

@Component({
    selector: 'app-edit-event',
    standalone: true,
    templateUrl: './edit-event.component.html',
    imports: [
        CommonModule, 
        GoBackTopBarComponent,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MtxDatetimepickerModule,
        MtxNativeDatetimeModule
    ],
    providers: [
        {
          provide: MTX_DATETIME_FORMATS,
          useValue: {
            parse: {
              dateInput: 'YYYY-MM-DD',
              monthInput: 'MMMM',
              yearInput: 'YYYY',
              timeInput: 'HH:mm',
              datetimeInput: 'YYYY-MM-DD HH:mm',
            },
            display: {
              dateInput: 'YYYY-MM-DD',
              monthInput: 'MMMM',
              yearInput: 'YYYY',
              timeInput: 'HH:mm',
              datetimeInput: 'YYYY-MM-DD HH:mm',
              monthYearLabel: 'YYYY MMMM',
              dateA11yLabel: 'LL',
              monthYearA11yLabel: 'MMMM YYYY',
              popupHeaderDateLabel: 'MMM DD, ddd',
            },
          },
        },
      ]
})
export class EditEventComponent {
    private currentEventId: number = -1;

    public eventForm: FormGroup;
    public readonly eventNameMaxLength: number = 255;

    public type: MtxDatetimepickerType = 'time';
    public mode: MtxDatetimepickerMode = 'auto';
    public startView: MtxCalendarView = 'clock';
    public multiYearSelector = false;
    public touchUi = true;
    public twelvehour = false;
    public timeInterval = 1;
    public timeInput = true;

    public constructor(private fb: FormBuilder) {
        this.eventForm = this.createEventForm();
    }

    private createEventForm(): FormGroup {
        return this.fb.group({
            name: ['', Validators.required, Validators.maxLength(this.eventNameMaxLength)],
            startingDateTime: [new Date(), Validators.required],
            endingDateTime: [new Date(), Validators.required],
            allDay: [false],
        });
    }

    private getEvent(): Event {
        const event: Event = this.eventForm.value as Event;
        event.id = this.currentEventId;
        return event;
    }
}
