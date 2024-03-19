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
import { TranslocoModule, TranslocoService, provideTranslocoScope } from '@ngneat/transloco';
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
    providers: [
        provideTranslocoScope({scope: 'event/ui/page/edit-event-page', alias: 'editEventPage'})
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditEventPageComponent implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();

    public currentEventId: number = 0;

    public readonly editEventForm: FormGroup = this.createEventForm();
    public readonly editEventForm$: Observable<FormGroup> = this.getEditEventForm$();

    public readonly nameCode: string = 'name';
    public readonly startingDateCode: string = 'startingDate';
    public readonly startingTimeCode: string = 'startingTime';
    public readonly endingDateCode: string = 'endingDate';
    public readonly endingTimeCode: string = 'endingTime';
    public readonly allDayCode: string = 'allDay';

    private readonly maxLengthErrorCode: string = 'maxlength';
    private readonly requiredErrorCode: string = 'required';
    private readonly greaterThanEndingDateTimeErrorCode: string = 'greater-than-ending-date-time';
    private readonly lesserThanStartingDateTimeErrorCode: string = 'lesser-than-starting-date-time';

    public readonly times: number[] = EventTimeHelper.getTimes();

    public constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly formBuilder: FormBuilder,
        private readonly editEventService: EditEventService,
        private readonly eventCurrentDateService: EventCurrentDateService,
        private readonly translocoService: TranslocoService
    ) { }

    public ngOnInit(): void {
        this.editEventForm.valueChanges
        .pipe(
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
        this.destroy$.next();
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

    public getNameControl(): AbstractControl<any, any> {
        return this.editEventForm.controls[this.nameCode];
    }

    public getStartingDateControl(): AbstractControl<any, any> {
        return this.editEventForm.controls[this.startingDateCode];
    }

    public getStartingTimeControl(): AbstractControl<any, any> {
        return this.editEventForm.controls[this.startingTimeCode];
    }

    public getEndingDateControl(): AbstractControl<any, any> {
        return this.editEventForm.controls[this.endingDateCode];
    }

    public getEndingTimeControl(): AbstractControl<any, any> {
        return this.editEventForm.controls[this.endingTimeCode];
    }

    public getAllDayControl(): AbstractControl<any, any> {
        return this.editEventForm.controls[this.allDayCode];
    }

    public updateNameControl(name: string): void {
        this.getNameControl().setValue(name);
    }

    public updateStartingDateControl(startingDate: Date|undefined) {
        this.getStartingDateControl().setValue(startingDate);
    }

    public updateStartingTimeControl(startingTime: number|undefined) {
        this.getStartingTimeControl().setValue(startingTime);
    }

    public updateEndingDateControl(endingDate: Date|undefined) {
        this.getEndingDateControl().setValue(endingDate);
    }

    public updateEndingTimeControl(endingTime: number|undefined) {
        this.getEndingTimeControl().setValue(endingTime);
    }

    public updateAllDayControl(allDay: boolean) {
        this.getAllDayControl().setValue(allDay);
    }

    public updateEditEventForm(event: EditEventViewModel): FormGroup {
        this.updateNameControl(event.name);
        this.updateStartingDateControl(event.startingDate);
        this.updateStartingTimeControl(event.startingTime);
        this.updateEndingDateControl(event.endingDate);
        this.updateEndingTimeControl(event.endingTime);
        this.updateAllDayControl(event.allDay);

        return this.editEventForm;
    }
    
    public manageGreaterThanEndingDateTimeError(): void {
        const startingDateControl: AbstractControl<any, any> = this.getStartingDateControl();
        if (!startingDateControl.value) {
            return;
        }

        const startingTimeControl: AbstractControl<any, any> = this.getStartingTimeControl();
        const allDay: boolean = this.getAllDayControl().value;

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

        const endingDateControl: AbstractControl<any, any> = this.getEndingDateControl();
        if (!endingDateControl.valid) {
            endingDateControl.setErrors({[this.lesserThanStartingDateTimeErrorCode]: null}, {emitEvent: false});
            endingDateControl.updateValueAndValidity({emitEvent: false});
        }
        const endingTimeControl: AbstractControl<any, any> = this.getEndingTimeControl();
        if (!allDay && !endingTimeControl.valid) {
            endingTimeControl.setErrors({[this.lesserThanStartingDateTimeErrorCode]: true}, {emitEvent: false});
            endingTimeControl.updateValueAndValidity({emitEvent: false});
        }
    }

    private checkDateTimesConsistencyOnStartingDateChanged(): void {
        this.getStartingDateControl().valueChanges.
        pipe(
            tap(() => this.manageGreaterThanEndingDateTimeError()),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    private checkDateTimesConsistencyOnStartingTimeChanged(): void {
        this.getStartingTimeControl().valueChanges.
        pipe(
            tap(() => this.manageGreaterThanEndingDateTimeError()),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    public manageLesserThanStartingDateTimeError(): void {
        const endingDateControl: AbstractControl<any, any> = this.getEndingDateControl();
        if (!endingDateControl.value) {
            return;
        }

        const endingTimeControl: AbstractControl<any, any> = this.getEndingTimeControl();
        const allDay: boolean = this.getAllDayControl().value;

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

        const startingDateControl: AbstractControl<any, any> = this.getStartingDateControl();
        if (!startingDateControl.valid) {
            startingDateControl.setErrors({[this.greaterThanEndingDateTimeErrorCode]: null}, {emitEvent: false});
            startingDateControl.updateValueAndValidity({emitEvent: false});
        }
        const startingTimeControl: AbstractControl<any, any> = this.getStartingTimeControl();
        if (!allDay && !startingTimeControl.valid) {
            startingTimeControl.setErrors({[this.greaterThanEndingDateTimeErrorCode]: true}, {emitEvent: false});
            startingTimeControl.updateValueAndValidity({emitEvent: false});
        }
    }

    private checkDateTimesConsistencyOnEndingDateChanged(): void {
        this.getEndingDateControl().valueChanges.
        pipe(
            tap(() => this.manageLesserThanStartingDateTimeError()),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    private checkDateTimesConsistencyOnEndingTimeChanged(): void {
        this.getEndingTimeControl().valueChanges.
        pipe(
            tap(() => this.manageLesserThanStartingDateTimeError()),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    public setTimeDependOnAllDayValue(allDay: boolean): void {
        const startingTimeControl: AbstractControl = this.getStartingTimeControl();
        const endingTimeControl: AbstractControl = this.getEndingTimeControl();
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
        this.getAllDayControl().valueChanges.
        pipe(
            tap((allDay: boolean) => this.setTimeDependOnAllDayValue(allDay)),
            tap(() => this.manageGreaterThanEndingDateTimeError()),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    public getNameErrorMessage(): Observable<string|undefined> {
        const nameControl: AbstractControl<any, any> = this.getNameControl();

        if (nameControl.hasError(this.requiredErrorCode)) {
            return this.translocoService.selectTranslate('editEventPage.nameRequired');
        } else if (nameControl.hasError(this.maxLengthErrorCode)) {
            const maxLength = nameControl.getError(this.maxLengthErrorCode)['requiredLength'];
            return this.translocoService.selectTranslate('editEventPage.nameTooLong', {maxLength: maxLength})
        }

        return of(undefined);
    }

    public getStartingDateErrorMessage(): Observable<string|undefined> {
        const startingDateControl: AbstractControl<any, any> = this.getStartingDateControl();

        if (startingDateControl.hasError(this.requiredErrorCode)) {
            return this.translocoService.selectTranslate('editEventPage.startingDateRequired');
        } else if (startingDateControl.hasError(this.greaterThanEndingDateTimeErrorCode)) {
            const allDay: boolean = this.getAllDayControl().value;
            if (!allDay) {
                return this.translocoService.selectTranslate('editEventPage.greaterThanEndingDateTime');
            } else {
                return this.translocoService.selectTranslate('editEventPage.greaterThanEndingDate');
            }
        }

        return of(undefined);
    }

    public getStartingTimeErrorMessage(): Observable<string|undefined> {
        const startingTimeControl: AbstractControl<any, any> = this.getStartingTimeControl();

        if (startingTimeControl.hasError(this.requiredErrorCode)) {
            return this.translocoService.selectTranslate('editEventPage.startingTimeRequired');
        } else if (startingTimeControl.hasError(this.greaterThanEndingDateTimeErrorCode)) {
            return this.translocoService.selectTranslate('editEventPage.greaterThanEndingDateTime');
        }

        return of(undefined);
    }

    public getEndingDateErrorMessage(): Observable<string|undefined> {
        const endingDateControl: AbstractControl<any, any> = this.getEndingDateControl();

        if (endingDateControl.hasError(this.requiredErrorCode)) {
            return this.translocoService.selectTranslate('editEventPage.endingDateRequired');
        } else if (endingDateControl.hasError(this.lesserThanStartingDateTimeErrorCode)) {
            const allDay: boolean = this.getAllDayControl().value;
            if (!allDay) {
                return this.translocoService.selectTranslate('editEventPage.lesserThanStartingDateTime');
            } else {
                return this.translocoService.selectTranslate('editEventPage.lesserThanStartingDate');
            }
        }

        return of(undefined);
    }

    public getEndingTimeErrorMessage(): Observable<string|undefined> {
        const endingTimeControl: AbstractControl<any, any> = this.getEndingTimeControl();

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
