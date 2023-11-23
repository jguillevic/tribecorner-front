import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateHelperService {
  public constructor() { }

  public areUTCDatesEqual(date1: Date, date2: Date): boolean {
    return date1.getUTCDate() === date2.getUTCDate() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCFullYear() === date2.getUTCFullYear();
  }

  public areUTCTimesEqual(date1: Date, date2: Date): boolean {
    return date1.getUTCHours() === date2.getUTCHours() &&
    date1.getUTCMinutes() === date2.getUTCMinutes() &&
    date1.getUTCSeconds() === date2.getUTCSeconds() &&
    date1.getUTCMilliseconds() === date2.getUTCMilliseconds();
  }

  public areUTCDatesAndTimesEqual(date1: Date, date2: Date): boolean {
    return this.areUTCDatesEqual(date1, date2) &&
    this.areUTCTimesEqual(date1, date2);
  }

  public getInvariantDateWithoutTimeZone(date: Date): Date {
    const utcDate = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0
    );
    
    return new Date(utcDate);
  }

  public getInvarianteCurrentDateWithoutTimeZone(): Date {
    const date = new Date();
    const utcDate = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0
    );
    
    return new Date(utcDate);
  }
}
