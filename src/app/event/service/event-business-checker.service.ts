import { Injectable } from '@angular/core';
import { Event } from "../model/event.model";

@Injectable({
  providedIn: 'root'
})
export class EventBusinessCheckerService {
  public isStartingDateTimeStriclyGreaterThanEndingDateTime(event: Event): boolean {
    return event.startingDateTime > event.endingDateTime;
  }

  public isStartingDateTimeGreaterThanEndingDateTime(event: Event): boolean {
    return event.startingDateTime >= event.endingDateTime;
  }
}
