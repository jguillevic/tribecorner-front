import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from 'src/app/event/model/event.model';

@Injectable()
export class EventService {

  public constructor() { }

  public loadAllByDate(date: Date): Observable<Event[]> {
    const event1 = new Event();
    event1.name = 'Événement 1';
    const event2 = new Event();
    event2.name = 'Événement 2';

    return of(
      [
        event1,
        event2
      ]
      );
  }
}
