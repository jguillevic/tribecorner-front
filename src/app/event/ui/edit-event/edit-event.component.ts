import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoBackTopBarComponent } from "../../../common/top-bar/go-back/ui/go-back-top-bar.component";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, Subject, combineLatest, debounceTime, filter, map, mergeMap, of, switchMap, takeUntil, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { EventCurrentDateService } from '../../service/event-current-date.service';
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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditEventComponent implements OnInit, OnDestroy {
    private currentEventId: number = 0;
    private previousAllDay: boolean|undefined;
    private readonly editEventForm: FormGroup = this.createEventForm();
    private readonly destroy$ = new Subject<void>();

    public readonly nameCode: string = 'name';
    public readonly startingDateCode: string = 'startingDate';
    public readonly startingTimeCode: string = 'startingTime';
    public readonly endingDateCode: string = 'endingDate';
    public readonly endingTimeCode: string = 'endingTime';
    public readonly allDayCode: string = 'allDay';

    public readonly maxLengthErrorCode: string = 'maxlength';
    public readonly requiredErrorCode: string = 'required';
    public readonly greaterThanEndingDateTimeErrorCode: string = 'greater-than-ending-date-time';
    public readonly lesserThanStartingDateTimeErrorCode: string = 'lesser-than-starting-date-time';

    public readonly editEventForm$ = this.getEditEventForm$();

    public readonly times: number[] = EditEventComponent.getTimes();

    public constructor(
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private editEventService: EditEventService,
        private eventCurrentDateService: EventCurrentDateService
    ) { }

    private createEventForm(): FormGroup {
        return this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(255)]],
            startingDate: [new Date(), Validators.required],
            startingTime: [0, Validators.required],
            endingDate: [new Date(), Validators.required],
            endingTime: [0, Validators.required],
            allDay: [false],
        });
    }

    public ngOnInit(): void {
        this.editEventForm.valueChanges.pipe(
            tap(form => {
                const allDay: boolean = form[this.allDayCode];
                if (this.previousAllDay !== undefined && this.previousAllDay !== allDay) {
                    const startingTimeControl: AbstractControl = this.editEventForm.controls[this.startingTimeCode];
                    const endingTimeControl: AbstractControl = this.editEventForm.controls[this.endingTimeCode];
                    if (allDay) {
                        startingTimeControl.setValue(0, {emitEvent: false});
                        startingTimeControl.disable({emitEvent: false});
                        endingTimeControl.setValue(0, {emitEvent: false});
                        endingTimeControl.disable({emitEvent: false});
                    } else {
                        startingTimeControl.setValue(EditEventComponent.getDefaultStartingTime(), {emitEvent: false});
                        startingTimeControl.enable({emitEvent: false});
                        endingTimeControl.setValue(EditEventComponent.getDefaultEndingTime(), {emitEvent: false});
                        endingTimeControl.enable({emitEvent: false});
                    }
                }

                this.previousAllDay = allDay;
            }),
            debounceTime(500),
            filter(() => !this.editEventForm.pristine && this.editEventForm.valid),
            switchMap(() => this.save()),
            takeUntil(this.destroy$)
        )
        .subscribe();

        this.checkDateTimesConsistencyOnStartingDateChanged();
        this.checkDateTimesConsistencyOnStartingTimeChanged();
        this.checkDateTimesConsistencyOnEndingDateChanged();
        this.checkDateTimesConsistencyOnEndingTimeChanged();
        this.checkDateTimesConsistencyOnAllDayChanged();
    }

    public ngOnDestroy(): void {
        this.destroy$.complete();
    }
    
    private manageGreaterThanEndingDateTimeError(): void {
        const startingDateControl: AbstractControl<any, any> = this.editEventForm.controls[this.startingDateCode];
        const startingTimeControl: AbstractControl<any, any> = this.editEventForm.controls[this.startingTimeCode];
        const allDay: boolean = this.editEventForm.controls[this.allDayCode].value;
        if (this.editEventService.isStartingDateTimeGreaterThanEndingDateTime(this.getEditEventViewModel())) {
            startingDateControl.setErrors({[this.greaterThanEndingDateTimeErrorCode]: true}, {emitEvent: false});
            startingDateControl.markAsTouched();
            if (!allDay) {
                startingTimeControl.setErrors({[this.greaterThanEndingDateTimeErrorCode]: true}, {emitEvent: false});
                startingTimeControl.markAsTouched();
            }
        } else {
            startingDateControl.setErrors({[this.greaterThanEndingDateTimeErrorCode]: null}, {emitEvent: false});
            startingDateControl.updateValueAndValidity({emitEvent: false});
            if (!allDay) {
                startingTimeControl.setErrors({[this.greaterThanEndingDateTimeErrorCode]: true}, {emitEvent: false});
                startingTimeControl.updateValueAndValidity({emitEvent: false});
            }
        }

        const endingDateControl: AbstractControl<any, any> = this.editEventForm.controls[this.endingDateCode];
        if (!endingDateControl.valid) {
            endingDateControl.setErrors({[this.lesserThanStartingDateTimeErrorCode]: null}, {emitEvent: false});
            endingDateControl.updateValueAndValidity({emitEvent: false});
        }
        const endingTimeControl: AbstractControl<any, any> = this.editEventForm.controls[this.endingTimeCode];
        if (!allDay && !endingTimeControl.valid) {
            endingTimeControl.setErrors({[this.lesserThanStartingDateTimeErrorCode]: true}, {emitEvent: false});
            endingTimeControl.updateValueAndValidity({emitEvent: false});
        }
    }

    private checkDateTimesConsistencyOnStartingDateChanged(): void {
        this.editEventForm.controls[this.startingDateCode].valueChanges.
        pipe(
            tap(() => this.manageGreaterThanEndingDateTimeError()),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    private checkDateTimesConsistencyOnStartingTimeChanged(): void {
        this.editEventForm.controls[this.startingTimeCode].valueChanges.
        pipe(
            tap(() => this.manageGreaterThanEndingDateTimeError()),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    private checkDateTimesConsistencyOnAllDayChanged(): void {
        this.editEventForm.controls[this.allDayCode].valueChanges.
        pipe(
            tap(() => this.manageGreaterThanEndingDateTimeError()),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    private manageLesserThanStartingDateTimeError(): void {
        const endingDateControl: AbstractControl<any, any> = this.editEventForm.controls[this.endingDateCode];
        const endingTimeControl: AbstractControl<any, any> = this.editEventForm.controls[this.endingTimeCode];
        const allDay: boolean = this.editEventForm.controls[this.allDayCode].value;
        if (this.editEventService.isStartingDateTimeGreaterThanEndingDateTime(this.getEditEventViewModel())) {
            endingDateControl.setErrors({[this.lesserThanStartingDateTimeErrorCode]: true}, {emitEvent: false});
            endingDateControl.markAsTouched();
            if (!allDay) {
                endingTimeControl.setErrors({[this.lesserThanStartingDateTimeErrorCode]: true}, {emitEvent: false});
                endingTimeControl.markAsTouched();
            }
        } else {
            endingDateControl.setErrors({[this.lesserThanStartingDateTimeErrorCode]: null}, {emitEvent: false});
            endingDateControl.updateValueAndValidity({emitEvent: false});
            if (!allDay) {
                endingTimeControl.setErrors({[this.lesserThanStartingDateTimeErrorCode]: true}, {emitEvent: false});
                endingTimeControl.updateValueAndValidity({emitEvent: false});
            }
        }

        const startingDateControl: AbstractControl<any, any> = this.editEventForm.controls[this.startingDateCode];
        if (!startingDateControl.valid) {
            startingDateControl.setErrors({[this.greaterThanEndingDateTimeErrorCode]: null}, {emitEvent: false});
            startingDateControl.updateValueAndValidity({emitEvent: false});
        }
        const startingTimeControl: AbstractControl<any, any> = this.editEventForm.controls[this.startingTimeCode];
        if (!allDay && !startingTimeControl.valid) {
            startingTimeControl.setErrors({[this.greaterThanEndingDateTimeErrorCode]: true}, {emitEvent: false});
            startingTimeControl.updateValueAndValidity({emitEvent: false});
        }
    }

    private checkDateTimesConsistencyOnEndingDateChanged(): void {
        this.editEventForm.controls[this.endingDateCode].valueChanges.
        pipe(
            tap(() => this.manageLesserThanStartingDateTimeError()),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    public getNameErrorMessage(): string|undefined {
        const nameControl: AbstractControl<any, any> = this.editEventForm.controls[this.nameCode];

        if (nameControl.hasError(this.maxLengthErrorCode)) {
            const maxLength = nameControl.getError(this.maxLengthErrorCode)['requiredLength'];
            return `Nom trop long (max. ${maxLength} caractères)`;
        } else if (nameControl.hasError(this.requiredErrorCode)) {
            return 'Nom requis';
        }

        return undefined;
    }

    private checkDateTimesConsistencyOnEndingTimeChanged(): void {
        this.editEventForm.controls[this.endingTimeCode].valueChanges.
        pipe(
            tap(() => this.manageLesserThanStartingDateTimeError()),
            takeUntil(this.destroy$)
        ).subscribe();
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
                    defaultDate,
                    EditEventComponent.getDefaultStartingTime(),
                    defaultDate,
                    EditEventComponent.getDefaultEndingTime(),
                    false
                );
                return of(editEventViewModel);
                }),
                tap(event => {
                this.editEventForm.controls[this.nameCode].setValue(event.name);
                this.editEventForm.controls[this.startingDateCode].setValue(event.startingDate);
                this.editEventForm.controls[this.startingTimeCode].setValue(event.startingTime);
                this.editEventForm.controls[this.endingDateCode].setValue(event.endingDate);
                this.editEventForm.controls[this.endingTimeCode].setValue(event.endingTime);
                this.editEventForm.controls[this.allDayCode].setValue(event.allDay);
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
