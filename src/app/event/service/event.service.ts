import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from 'src/app/event/model/event.model';

@Injectable()
export class EventService {

  constructor() { }

  public loadAll(): Observable<Event[]> {
    return of([]);
  }
}
