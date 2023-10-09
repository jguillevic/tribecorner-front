import { Component, EventEmitter, LOCALE_ID, OnInit, Output } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { CalendarDate } from '../../model/calendar-date.model';

@Component({
  selector: 'app-inline-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inline-calendar.component.html',
  styles: [
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }]
})
export class InlineCalendarComponent implements OnInit {
  @Output() public onSelectedDateChanged: EventEmitter<Date> = new EventEmitter<Date>();
  public selectedCalendarDate: CalendarDate|undefined;
  public calendarDates: CalendarDate[] = [];

  public constructor() {
    registerLocaleData(fr.default);
  }

  public ngOnInit(): void {
    for (let i = 0; i < 30; i++) {
      const date: Date = new Date();
      date.setDate(date.getDate() + i);
      const calendarDate: CalendarDate = new CalendarDate();
      calendarDate.date = date;
      this.calendarDates.push(calendarDate);
    }

    this.selectedCalendarDate = this.calendarDates[0];
    this.selectedCalendarDate.isSelected = true;
    this.onSelectedDateChanged.emit(this.selectedCalendarDate.date);
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