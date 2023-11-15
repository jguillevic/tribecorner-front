import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class EventCurrentDateService {
  private currentDateSubject: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  public currentDate$ = this.currentDateSubject.asObservable();

  public constructor() { }

  public selectDate(date: Date): void {
    this.currentDateSubject.next(date);
  }
}
