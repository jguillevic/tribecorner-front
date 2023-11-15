import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoBackTopBarComponent } from "../../../common/top-bar/go-back/ui/go-back-top-bar.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Event } from '../../model/event.model';
import { MtxCalendarView, MtxDatetimepickerMode, MtxDatetimepickerType } from '@ng-matero/extensions/datetimepicker';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MtxMomentDatetimeModule } from '@ng-matero/extensions-moment-adapter';
import { MTX_DATETIME_FORMATS } from '@ng-matero/extensions/core';
import { Observable, Subject, combineLatest, debounceTime, filter, map, mergeMap, of, switchMap, takeUntil, tap } from 'rxjs';
import { EventService } from '../../service/event.service';
import { ActivatedRoute } from '@angular/router';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { EventCurrentDateService } from '../../service/event-current-date.service';

@Component({
    selector: 'app-edit-event',
    standalone: true,
    templateUrl: './edit-event.component.html',
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
    ],
    imports: [
        CommonModule,
        GoBackTopBarComponent,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MtxDatetimepickerModule,
        MtxMomentDatetimeModule,
        SimpleLoadingComponent
    ]
})
export class EditEventComponent implements OnInit, OnDestroy {
    private currentEventId: number = -1;
    private readonly editEventForm: FormGroup;
    private destroy$ = new Subject<void>();

    public readonly eventNameMaxLength: number = 255;
    public editEventForm$ = this.getEditEventForm$();

    public type: MtxDatetimepickerType = 'datetime';
    public mode: MtxDatetimepickerMode = 'auto';
    public startView: MtxCalendarView = 'clock';
    public multiYearSelector = false;
    public touchUi = true;
    public twelvehour = false;
    public timeInterval = 1;
    public timeInput = true;

    public constructor(
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private eventService: EventService,
        private eventCurrentDateService: EventCurrentDateService
    ) {
        this.editEventForm = this.createEventForm();
    }

    private createEventForm(): FormGroup {
        return this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(this.eventNameMaxLength)]],
            startingDateTime: [new Date(), Validators.required],
            endingDateTime: [new Date(), Validators.required],
            allDay: [false],
        });
    }

    public ngOnInit(): void {
        this.editEventForm.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(500),
            filter(() => !this.editEventForm.pristine && this.editEventForm.valid),
            switchMap(() => this.save())
        )
        .subscribe();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    
    private getEvent(): Event {
        const event: Event = this.editEventForm.value as Event;
        event.id = this.currentEventId;
        return event;
    }

    private getEditEventForm$(): Observable<FormGroup> {
        return combineLatest(
            {
                params: this.activatedRoute.queryParams,
                currentDate: this.eventCurrentDateService.currentDate$
            }
        )
        .pipe(
            mergeMap(result => {        
                if (result.params['id']) {
                    this.currentEventId = result.params['id'];
                    if (this.currentEventId) {
                    return this.eventService.loadOneById(this.currentEventId);
                    }
                }
                const event: Event = new Event();
                const defaultDate = result.currentDate;
                event.startingDateTime = new Date(defaultDate);
                event.endingDateTime = new Date(defaultDate);
                event.endingDateTime.setHours(event.endingDateTime.getHours() + 1);
                return of(event);
                }),
                tap(event => {
                this.editEventForm.controls['name'].setValue(event.name);
                this.editEventForm.controls['startingDateTime'].setValue(event.startingDateTime);
                this.editEventForm.controls['endingDateTime'].setValue(event.endingDateTime);
                this.editEventForm.controls['allDay'].setValue(event.allDay);
            }),
            map(() => this.editEventForm)
        );
    }

    private save(): Observable<Event> {
        const event: Event = this.getEvent();
    
        if (this.currentEventId !== undefined) {
          return this.eventService.update(event);
        }
    
        return this.eventService.create(event)
        .pipe(
            tap(event => this.currentEventId = event.id)
        );
    }
}
