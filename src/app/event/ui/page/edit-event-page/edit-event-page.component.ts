import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Observable, Subject, combineLatest, debounceTime, exhaustMap, filter, map, mergeMap, of, takeUntil, tap } from 'rxjs';
import { GoBackTopBarComponent } from "../../../../common/top-bar/go-back/ui/go-back-top-bar.component";
import { SimpleLoadingComponent } from "../../../../common/loading/ui/simple-loading/simple-loading.component";
import { EventCurrentDateService } from '../../../service/event-current-date.service';
import { EditEventService } from '../../../service/edit-event.service';
import { EditEventViewModel } from '../../view-model/edit-event.view-model';
import { TimeToStringPipe } from "../../../../common/date/pipe/time-to-string.pipe";
import { EventTimeHelper } from '../../../helper/event-time.helper';

@Component({
    selector: 'app-edit-event-page',
    standalone: true,
    templateUrl: './edit-event-page.component.html',
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
        TimeToStringPipe,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditEventComponent implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();

    public currentEventId: number = 0;

    private readonly editEventForm: FormGroup = this.createEventForm();
    public readonly editEventForm$: Observable<FormGroup> = this.getEditEventForm$();

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

    public readonly times: number[] = EventTimeHelper.getTimes();

    public constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        private readonly editEventService: EditEventService,
        private readonly eventCurrentDateService: EventCurrentDateService,
        private readonly translocoService: TranslocoService
    ) { }

    public ngOnInit(): void {
        this.editEventForm.valueChanges.pipe(
            debounceTime(500),
            filter(() => 
                !this.editEventForm.pristine &&
                this.editEventForm.valid
            ),          
            exhaustMap(() => this.save()),
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

    public createEventForm(): FormGroup {
        return this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(255)]],
            startingDate: [new Date(), Validators.required],
            startingTime: [0, Validators.required],
            endingDate: [new Date(), Validators.required],
            endingTime: [0, Validators.required],
            allDay: [false],
        });
    }
    
    private manageGreaterThanEndingDateTimeError(): void {
        const startingDateControl: AbstractControl<any, any> = this.editEventForm.controls[this.startingDateCode];
        const startingTimeControl: AbstractControl<any, any> = this.editEventForm.controls[this.startingTimeCode];
        const allDay: boolean = this.editEventForm.controls[this.allDayCode].value;

        if (allDay) {
            if (this.editEventService.isStartingDateTimeStriclyGreaterThanEndingDateTime(this.getEditEventViewModel())) {
                startingDateControl.setErrors({[this.greaterThanEndingDateTimeErrorCode]: true}, {emitEvent: false});
                startingDateControl.markAsTouched();
            } else {
                startingDateControl.setErrors({[this.greaterThanEndingDateTimeErrorCode]: null}, {emitEvent: false});
                startingDateControl.updateValueAndValidity({emitEvent: false});
            }
        } else {
            if (this.editEventService.isStartingDateTimeGreaterThanEndingDateTime(this.getEditEventViewModel())) {
                startingDateControl.setErrors({[this.greaterThanEndingDateTimeErrorCode]: true}, {emitEvent: false});
                startingDateControl.markAsTouched();
                startingTimeControl.setErrors({[this.greaterThanEndingDateTimeErrorCode]: true}, {emitEvent: false});
                startingTimeControl.markAsTouched();
            } else {
                startingDateControl.setErrors({[this.greaterThanEndingDateTimeErrorCode]: null}, {emitEvent: false});
                startingDateControl.updateValueAndValidity({emitEvent: false});
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

    private manageLesserThanStartingDateTimeError(): void {
        const endingDateControl: AbstractControl<any, any> = this.editEventForm.controls[this.endingDateCode];
        const endingTimeControl: AbstractControl<any, any> = this.editEventForm.controls[this.endingTimeCode];
        const allDay: boolean = this.editEventForm.controls[this.allDayCode].value;

        if (allDay) {
            if (this.editEventService.isStartingDateTimeStriclyGreaterThanEndingDateTime(this.getEditEventViewModel())) {
                endingDateControl.setErrors({[this.lesserThanStartingDateTimeErrorCode]: true}, {emitEvent: false});
                endingDateControl.markAsTouched();
            } else {
                endingDateControl.setErrors({[this.lesserThanStartingDateTimeErrorCode]: null}, {emitEvent: false});
                endingDateControl.updateValueAndValidity({emitEvent: false});
            }
        } else {
            if (this.editEventService.isStartingDateTimeGreaterThanEndingDateTime(this.getEditEventViewModel())) {
                endingDateControl.setErrors({[this.lesserThanStartingDateTimeErrorCode]: true}, {emitEvent: false});
                endingDateControl.markAsTouched();
                endingTimeControl.setErrors({[this.lesserThanStartingDateTimeErrorCode]: true}, {emitEvent: false});
                endingTimeControl.markAsTouched();
            } else {
                endingDateControl.setErrors({[this.lesserThanStartingDateTimeErrorCode]: null}, {emitEvent: false});
                endingDateControl.updateValueAndValidity({emitEvent: false});
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

    private checkDateTimesConsistencyOnEndingTimeChanged(): void {
        this.editEventForm.controls[this.endingTimeCode].valueChanges.
        pipe(
            tap(() => this.manageLesserThanStartingDateTimeError()),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    public setTimeDependOnAllDayValue(allDay: boolean): void {
        const startingTimeControl: AbstractControl = this.editEventForm.controls[this.startingTimeCode];
        const endingTimeControl: AbstractControl = this.editEventForm.controls[this.endingTimeCode];
        if (allDay) {
            startingTimeControl.setValue(0, {emitEvent: false});
            startingTimeControl.disable({emitEvent: false});
            endingTimeControl.setValue(0, {emitEvent: false});
            endingTimeControl.disable({emitEvent: false});
        } else {
            startingTimeControl.setValue(EventTimeHelper.getDefaultStartingTime(), {emitEvent: false});
            startingTimeControl.enable({emitEvent: false});
            endingTimeControl.setValue(EventTimeHelper.getDefaultEndingTime(), {emitEvent: false});
            endingTimeControl.enable({emitEvent: false});
        }
    }

    private checkDateTimesConsistencyOnAllDayChanged(): void {
        this.editEventForm.controls[this.allDayCode].valueChanges.
        pipe(
            tap((allDay: boolean) => this.setTimeDependOnAllDayValue(allDay)),
            tap(() => this.manageGreaterThanEndingDateTimeError()),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    public getNameErrorMessage(): Observable<string|undefined> {
        const nameControl: AbstractControl<any, any> = this.editEventForm.controls[this.nameCode];

        if (nameControl.hasError(this.requiredErrorCode)) {
            return this.translocoService.selectTranslate('editEventPage.nameRequired');
        } else if (nameControl.hasError(this.maxLengthErrorCode)) {
            const maxLength = nameControl.getError(this.maxLengthErrorCode)['requiredLength'];
            return this.translocoService.selectTranslate('editEventPage.nameTooLong', {maxLength: maxLength})
        }

        return of(undefined);
    }

    public getStartingDateErrorMessage(): Observable<string|undefined> {
        const startingDateControl: AbstractControl<any, any> = this.editEventForm.controls[this.startingDateCode];

        if (startingDateControl.hasError(this.requiredErrorCode)) {
            return this.translocoService.selectTranslate('editEventPage.startingDateRequired');
        } else if (startingDateControl.hasError(this.greaterThanEndingDateTimeErrorCode)) {
            const allDay: boolean = this.editEventForm.controls[this.allDayCode].value;
            if (!allDay) {
                return this.translocoService.selectTranslate('editEventPage.greaterThanEndingDateTime');
            } else {
                return this.translocoService.selectTranslate('editEventPage.greaterThanEndingDate');
            }
        }

        return of(undefined);
    }

    public getStartingTimeErrorMessage(): Observable<string|undefined> {
        const startingTimeControl: AbstractControl<any, any> = this.editEventForm.controls[this.startingTimeCode];

        if (startingTimeControl.hasError(this.requiredErrorCode)) {
            return this.translocoService.selectTranslate('editEventPage.startingTimeRequired');
        } else if (startingTimeControl.hasError(this.greaterThanEndingDateTimeErrorCode)) {
            return this.translocoService.selectTranslate('editEventPage.greaterThanEndingDateTime');
        }

        return of(undefined);
    }

    public getEndingDateErrorMessage(): Observable<string|undefined> {
        const endingDateControl: AbstractControl<any, any> = this.editEventForm.controls[this.endingDateCode];

        if (endingDateControl.hasError(this.requiredErrorCode)) {
            return this.translocoService.selectTranslate('editEventPage.endingDateRequired');
        } else if (endingDateControl.hasError(this.lesserThanStartingDateTimeErrorCode)) {
            const allDay: boolean = this.editEventForm.controls[this.allDayCode].value;
            if (!allDay) {
                return this.translocoService.selectTranslate('editEventPage.lesserThanStartingDateTime');
            } else {
                return this.translocoService.selectTranslate('editEventPage.lesserThanStartingDate');
            }
        }

        return of(undefined);
    }

    public getEndingTimeErrorMessage(): Observable<string|undefined> {
        const endingTimeControl: AbstractControl<any, any> = this.editEventForm.controls[this.endingTimeCode];

        if (endingTimeControl.hasError(this.requiredErrorCode)) {
            return this.translocoService.selectTranslate('editEventPage.endingTimeRequired');
        } else if (endingTimeControl.hasError(this.lesserThanStartingDateTimeErrorCode)) {
            return this.translocoService.selectTranslate('editEventPage.lesserThanStartingDateTime');
        }

        return of(undefined);
    }

    public getEditEventViewModel(): EditEventViewModel {
        // getRawValue() utilisé car quand les champs sont 'disabled'
        // ils ne sont pas renvoyés par .value.
        const editEventViewModel: EditEventViewModel = this.editEventForm.getRawValue() as EditEventViewModel;
        editEventViewModel.id = this.currentEventId;
        return editEventViewModel;
    }

    public updateEditEventForm(event: EditEventViewModel): FormGroup {
        this.editEventForm.controls[this.nameCode].setValue(event.name);
        this.editEventForm.controls[this.startingDateCode].setValue(event.startingDate);
        this.editEventForm.controls[this.startingTimeCode].setValue(event.startingTime);
        this.editEventForm.controls[this.endingDateCode].setValue(event.endingDate);
        this.editEventForm.controls[this.endingTimeCode].setValue(event.endingTime);
        this.editEventForm.controls[this.allDayCode].setValue(event.allDay);

        return this.editEventForm;
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
                    EventTimeHelper.getDefaultStartingTime(),
                    defaultDate,
                    EventTimeHelper.getDefaultEndingTime(),
                    false
                );
                return of(editEventViewModel);
            }),
            map(event => this.updateEditEventForm(event))
        );
    }

    public save(): Observable<EditEventViewModel> {
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
