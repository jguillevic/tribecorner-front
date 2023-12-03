import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoBackTopBarComponent } from "../../../common/top-bar/go-back/ui/go-back-top-bar.component";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, Subject, combineLatest, debounceTime, filter, map, mergeMap, of, switchMap, takeUntil, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { EventCurrentDateService } from '../../service/event-current-date.service';
import { DateHelper } from 'src/app/common/date/helper/date.helper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { EditEventService } from '../../service/edit-event.service';
import { EditEventViewModel } from '../../view-model/edit-event.view-model';
import { TimeToStringPipe } from "../../../common/date/pipe/time-to-string.pipe";

@Component({
    selector: 'app-edit-event',
    standalone: true,
    templateUrl: './edit-event.component.html',
    providers: [],
    imports: [
        CommonModule,
        GoBackTopBarComponent,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        SimpleLoadingComponent,
        MatSlideToggleModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        TimeToStringPipe
    ]
})
export class EditEventComponent implements OnInit, OnDestroy {
    private currentEventId: number = 0;
    private previousAllDay: boolean|undefined;
    private readonly editEventForm: FormGroup;
    private readonly destroy$ = new Subject<void>();

    public readonly eventNameMaxLength: number = 255;
    public readonly editEventForm$ = this.getEditEventForm$();

    public readonly times: number[] = EditEventComponent.getTimes();

    public constructor(
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private editEventService: EditEventService,
        private eventCurrentDateService: EventCurrentDateService
    ) {
        this.editEventForm = this.createEventForm();
    }

    private createEventForm(): FormGroup {
        return this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(this.eventNameMaxLength)]],
            startingDate: [DateHelper.getInvariantCurrentDate(), Validators.required],
            startingTime: [0, Validators.required],
            endingDate: [DateHelper.getInvariantCurrentDate(), Validators.required],
            endingTime: [0, Validators.required],
            allDay: [false],
        });
    }

    public ngOnInit(): void {
        this.editEventForm.valueChanges.pipe(
            tap(form => {
                const allDay: boolean = form['allDay'];
                if (this.previousAllDay !== undefined && this.previousAllDay !== allDay) {
                    const startingTimeControl: AbstractControl = this.editEventForm.controls['startingTime'];
                    const endingTimeControl: AbstractControl = this.editEventForm.controls['endingTime'];
                    if (allDay) {
                        startingTimeControl.setValue(0, { emitEvent: false });
                        startingTimeControl.disable({emitEvent: false});
                        endingTimeControl.setValue(0, { emitEvent: false });
                        endingTimeControl.disable({emitEvent: false});
                    } else {
                        startingTimeControl.setValue(EditEventComponent.getDefaultStartingTime(), { emitEvent: false });
                        startingTimeControl.enable({emitEvent: false});
                        endingTimeControl.setValue(EditEventComponent.getDefaultEndingTime(), { emitEvent: false });
                        endingTimeControl.enable({emitEvent: false});
                    }
                }

                this.previousAllDay = allDay;
            }),
            takeUntil(this.destroy$),
            debounceTime(500),
            filter(() => !this.editEventForm.pristine && this.editEventForm.valid),
            switchMap(() => this.save())
        )
        .subscribe();
    }

    public ngOnDestroy(): void {
        this.destroy$.complete();
    }
    
    private static getTimes(): number[] {
        const times: number[] = [];

        for (let i: number = 0; i < 24; i++) {
            for (let j: number = 0; j < 4; j++) {
                times.push(i * 60 + j * 15);
            }
        }

        return times;
    }

    private static getDefaultTime(): number {
        let time: number = 0;
        const currentDate = new Date();

        // Récupération des heures.
        time += currentDate.getHours() * 60;
        // Récupération des minutes.
        time += Math.floor(currentDate.getMinutes() / 15) * 15;

        return time;
    }

    private static getDefaultStartingTime(): number {
        return EditEventComponent.getDefaultTime();
    }

    private static getDefaultEndingTime(): number {
        return EditEventComponent.getDefaultStartingTime() + 60;
    }

    private getEditEventViewModel(): EditEventViewModel {
        // getRawValue() utilisé car quand les champs sont 'disabled'
        // ils ne sont pas renvoyés par .value.
        const editEventViewModel: EditEventViewModel = this.editEventForm.getRawValue() as EditEventViewModel;
        editEventViewModel.id = this.currentEventId;
        return editEventViewModel;
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
                    return this.editEventService.loadOneById(this.currentEventId);
                    }
                }
                const defaultDate = result.currentDate;
                const editEventViewModel: EditEventViewModel = new EditEventViewModel(
                    0,
                    '',
                    DateHelper.getInvariantDate(defaultDate),
                    EditEventComponent.getDefaultStartingTime(),
                    DateHelper.getInvariantDate(defaultDate),
                    EditEventComponent.getDefaultEndingTime(),
                    false
                );
                return of(editEventViewModel);
                }),
                tap(event => {
                this.editEventForm.controls['name'].setValue(event.name);
                this.editEventForm.controls['startingDate'].setValue(event.startingDate);
                this.editEventForm.controls['startingTime'].setValue(event.startingTime);
                this.editEventForm.controls['endingDate'].setValue(event.endingDate);
                this.editEventForm.controls['endingTime'].setValue(event.endingTime);
                this.editEventForm.controls['allDay'].setValue(event.allDay);
            }),
            map(() => this.editEventForm)
        );
    }

    private save(): Observable<EditEventViewModel> {
        const editEventViewModel: EditEventViewModel = this.getEditEventViewModel();
    
        if (this.currentEventId) {
          return this.editEventService.update(editEventViewModel);
        }
    
        return this.editEventService.create(editEventViewModel)
        .pipe(
            tap(event => this.currentEventId = event.id)
        );
    }
}
