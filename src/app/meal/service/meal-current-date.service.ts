import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateHelperService } from 'src/app/common/date/service/date-helper.service';

@Injectable()
export class MealCurrentDateService {
  private currentDateSubject: BehaviorSubject<Date> 
  = new BehaviorSubject<Date>(
    this.dateHelperService.getInvarianteCurrentDateWithoutTimeZone()
  );
  public currentDate$ = this.currentDateSubject.asObservable();

  public constructor(private dateHelperService: DateHelperService) { }

  public selectDate(date: Date): void {
    this.currentDateSubject.next(date);
  }
}
