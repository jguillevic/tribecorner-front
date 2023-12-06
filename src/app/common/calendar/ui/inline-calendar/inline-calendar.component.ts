import { Component, EventEmitter, Input, LOCALE_ID, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { CalendarDate } from '../../model/calendar-date.model';
import { Observable, Subscription, tap } from 'rxjs';
import { DateHelper } from '../../../date/helper/date.helper';

@Component({
  selector: 'app-inline-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inline-calendar.component.html',
  styles: [
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
})
export class InlineCalendarComponent implements OnInit, OnDestroy {
  @Input() public defaultSelectedDate$: Observable<Date>|undefined;
  @Output() public onSelectedDateChanged: EventEmitter<Date> = new EventEmitter<Date>();

  private numberOfDates: number = 30;
  private defaultSelectedDateSubscription: Subscription|undefined;

  public selectedCalendarDate: CalendarDate | undefined;
  public calendarDates: CalendarDate[] = [];

  public constructor() {
    registerLocaleData(fr.default);
  }

  public ngOnDestroy(): void {
    this.defaultSelectedDateSubscription?.unsubscribe();
  }

  public ngOnInit(): void {
    for (let i = 0; i < this.numberOfDates; i++) {
      const date: Date = DateHelper.getCurrentDate();
      date.setDate(date.getDate() + i);
      const calendarDate: CalendarDate 
      = new CalendarDate(
        date,
        false
      );
      this.calendarDates.push(calendarDate);
    }

    if (this.defaultSelectedDate$) {
      this.defaultSelectedDateSubscription = this.defaultSelectedDate$
      .pipe(
        tap(defaultSelectedDate => {
          this.calendarDates.forEach(calendarDate => {
            if (DateHelper.areDatesEqual(defaultSelectedDate, calendarDate.date)) {
              this.selectedCalendarDate = calendarDate;
              this.selectedCalendarDate.isSelected = true;
              this.onSelectedDateChanged.emit(this.selectedCalendarDate.date);
            }
          });
        })
      )
      .subscribe();
    } else {
      this.selectedCalendarDate = this.calendarDates[0];
      this.selectedCalendarDate.isSelected = true;
      this.onSelectedDateChanged.emit(this.selectedCalendarDate.date);
    }
  }

  public selectCalendarDate(calendarDate: CalendarDate): void {
    if (
      this.selectedCalendarDate 
      && this.selectedCalendarDate.date !== calendarDate.date
    ) {
      this.selectedCalendarDate.isSelected = false;
      this.selectedCalendarDate = calendarDate;
      this.selectedCalendarDate.isSelected = true;
      this.onSelectedDateChanged.emit(this.selectedCalendarDate.date);
    }
  }
}