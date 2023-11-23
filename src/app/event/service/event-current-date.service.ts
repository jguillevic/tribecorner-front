import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateHelper } from 'src/app/common/date/helper/date.helper';

@Injectable()
export class EventCurrentDateService {
  private currentDateSubject: BehaviorSubject<Date> 
  = new BehaviorSubject<Date>(
    DateHelper.getInvarianteCurrentDateWithoutTimeZone()
  );
  public currentDate$ = this.currentDateSubject.asObservable();

  public constructor() { }

  public selectDate(date: Date): void {
    this.currentDateSubject.next(date);
  }
}
