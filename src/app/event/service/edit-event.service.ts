import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EventService } from './event.service';
import { EditEventViewModel } from '../ui/view-model/edit-event.view-model';
import { EditEventViewModelConverter } from '../converter/edit-event-view-model.converter';
import { Event } from "../model/event.model";
import { EventBusinessCheckerService } from './event-business-checker.service';

@Injectable()
export class EditEventService {
  public constructor(
    private eventService: EventService,
    private eventBusinessChecker: EventBusinessCheckerService
  ) { }

  public loadOneById(eventId: number): Observable<EditEventViewModel> {
    return this.eventService.loadOneById(eventId)
    .pipe(
      map(
        event => 
        EditEventViewModelConverter.fromModelToViewModel(event)
      )
    );
  }

  public create(editEventViewModel: EditEventViewModel): Observable<EditEventViewModel> {
    const event: Event 
    = EditEventViewModelConverter.fromViewModelToModel(editEventViewModel);

    return this.eventService.create(event)
    .pipe(
      map(event => 
        EditEventViewModelConverter.fromModelToViewModel(event)
      )
    );
  }

  public update(editEventViewModel: EditEventViewModel): Observable<EditEventViewModel> {
    const event: Event 
    = EditEventViewModelConverter.fromViewModelToModel(editEventViewModel);

    return this.eventService.update(event)
    .pipe(
      map(event => 
        EditEventViewModelConverter.fromModelToViewModel(event)
      )
    );
  }

  public isStartingDateTimeStriclyGreaterThanEndingDateTime(editEventViewModel: EditEventViewModel): boolean {
    const event: Event 
    = EditEventViewModelConverter.fromViewModelToModel(editEventViewModel);

    return this.eventBusinessChecker.isStartingDateTimeStriclyGreaterThanEndingDateTime(event);
  }

  public isStartingDateTimeGreaterThanEndingDateTime(editEventViewModel: EditEventViewModel): boolean {
    const event: Event 
    = EditEventViewModelConverter.fromViewModelToModel(editEventViewModel);

    return this.eventBusinessChecker.isStartingDateTimeGreaterThanEndingDateTime(event);
  }
}
