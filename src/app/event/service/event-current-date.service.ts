import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateHelper } from '../../common/date/helper/date.helper';

@Injectable({
  providedIn: 'root',
})
export class EventCurrentDateService {
  private currentDateSubject: BehaviorSubject<Date> 
  = new BehaviorSubject<Date>(
    DateHelper.getCurrentDate()
  );
  public currentDate$ = this.currentDateSubject.asObservable();

  public selectDate(date: Date): void {
    this.currentDateSubject.next(date);
  }
}
