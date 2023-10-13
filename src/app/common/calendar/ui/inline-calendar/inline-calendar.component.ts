import { Component, EventEmitter, Input, LOCALE_ID, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { CalendarDate } from '../../model/calendar-date.model';
import { Observable, Subscription } from 'rxjs';

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
  @Input() public defaultSelectedDateObservable: Observable<Date>|undefined;
  @Output() public onSelectedDateChanged: EventEmitter<Date> = new EventEmitter<Date>();

  private _numberOfDates: number = 7;
  private _defaultSelectedDateSubscription: Subscription|undefined;

  private _selectedCalendarDate: CalendarDate | undefined;
  public get selectedCalendarDate(): CalendarDate | undefined {
    return this._selectedCalendarDate;
  }
  public set selectedCalendarDate(value: CalendarDate | undefined) {
    this._selectedCalendarDate = value;
  }
  private _calendarDates: CalendarDate[] = [];
  public get calendarDates(): CalendarDate[] {
    return this._calendarDates;
  }
  public set calendarDates(value: CalendarDate[]) {
    this._calendarDates = value;
  }

  public constructor() {
    registerLocaleData(fr.default);
  }

  public ngOnDestroy(): void {
    this._defaultSelectedDateSubscription?.unsubscribe();
  }

  public ngOnInit(): void {
    for (let i = 0; i < this._numberOfDates; i++) {
      const date: Date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0,0,0,0);
      const calendarDate: CalendarDate = new CalendarDate();
      calendarDate.date = date;
      this.calendarDates.push(calendarDate);
    }

    if (this.defaultSelectedDateObservable) {
      this._defaultSelectedDateSubscription = this.defaultSelectedDateObservable
      .subscribe(defaultSelectedDate => {
        defaultSelectedDate.setHours(0,0,0,0);
        this.calendarDates.forEach(calendarDate => {
          if (defaultSelectedDate && defaultSelectedDate.getTime() == calendarDate.date.getTime()) {
            this.selectedCalendarDate = calendarDate;
            this.selectedCalendarDate.isSelected = true;
            this.onSelectedDateChanged.emit(this.selectedCalendarDate.date);
          }
        });
      });
    } else {
      this.selectedCalendarDate = this.calendarDates[0];
      this.selectedCalendarDate.isSelected = true;
      this.onSelectedDateChanged.emit(this.selectedCalendarDate.date);
    }
  }

  public selectCalendarDate(calendarDate: CalendarDate): void {
    if (
      this.selectedCalendarDate 
      && this.selectedCalendarDate.date != calendarDate.date
      ) {
      this.selectedCalendarDate.isSelected = false;
      this.selectedCalendarDate = calendarDate;
      this.selectedCalendarDate.isSelected = true;
      this.onSelectedDateChanged.emit(this.selectedCalendarDate.date);
    }
  }
}