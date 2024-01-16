import {Injectable} from '@angular/core';
import {Observable, map} from 'rxjs';
import {ApiHttpClient} from '../../common/http/api-http-client';
import {Event} from 'src/app/event/model/event.model';
import {environment} from '../../../environments/environment';
import {EventDto} from '../dto/event.dto';
import {EventConverter} from '../converter/event.converter';

@Injectable()
export class EventService {
  private static apiPath: string = "events";

  public constructor(private apiHttp: ApiHttpClient) { }

  public loadAllByDate(date: Date): Observable<Event[]> {
    const dateStr: string = date.toISOString();
    return this.apiHttp.get<EventDto[]>(
      `${environment.apiUrl}${EventService.apiPath}?date=${dateStr}`
    )
    .pipe(
      map(eventDtos => 
        eventDtos.map(eventDto =>
          EventConverter.fromDtoToModel(eventDto)
        )
      )
    );
  }

  public loadOneById(eventId: number): Observable<Event> {
    return this.apiHttp.get<EventDto>(
      `${environment.apiUrl}${EventService.apiPath}/${eventId}`
    )
    .pipe(
      map(
        eventDto => 
        EventConverter.fromDtoToModel(eventDto)
      )
    );
  }

  public create(event: Event): Observable<Event> {
    const eventDto: EventDto = EventConverter.fromModelToDto(event);
    const body: string = JSON.stringify(eventDto);

    return this.apiHttp.post<EventDto>(
      `${environment.apiUrl}${EventService.apiPath}`,
      body
    )
    .pipe(
      map(eventDto => 
          EventConverter.fromDtoToModel(eventDto)
      )
    );
  }

  public update(event: Event): Observable<Event> {
    const eventDto: EventDto = EventConverter.fromModelToDto(event);
    const body: string = JSON.stringify(eventDto);

    return this.apiHttp.put<EventDto>(
      `${environment.apiUrl}${EventService.apiPath}/${event.id}`,
      body
    )
    .pipe(
      map(eventDto => 
        EventConverter.fromDtoToModel(eventDto)
      )
    );
  }

  public delete(eventId: number): Observable<void> {
    return this.apiHttp.delete<void>(
      `${environment.apiUrl}${EventService.apiPath}/${eventId}`
    );
  }
}