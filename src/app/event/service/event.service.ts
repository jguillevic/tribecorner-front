import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiHttpClient } from 'src/app/common/http/api-http-client';
import { Event } from 'src/app/event/model/event.model';
import { environment } from 'src/environments/environment';
import { LoadEventDto } from '../dto/load-event.dto';
import { EventConverter } from '../converter/event.converter';
import { EditEventDto } from '../dto/edit-event.dto';
import { DateHelper } from '../../common/date/helper/date.helper';

@Injectable()
export class EventService {
  private static apiPath: string = "events";

  public constructor(private apiHttp: ApiHttpClient) { }

  public loadAllByDate(date: Date): Observable<Event[]> {
    const dateStr: string = DateHelper.toISOUTC(date);
    return this.apiHttp.get<LoadEventDto[]>(
      `${environment.apiUrl}${EventService.apiPath}?date=${dateStr}`
    )
    .pipe(
      map(loadEventDtos => 
        loadEventDtos.map(loadEventDto =>
          EventConverter.fromDtoToModel(loadEventDto)
        )
      )
    );
  }

  public loadOneById(eventId: number): Observable<Event> {
    return this.apiHttp.get<LoadEventDto>(
      `${environment.apiUrl}${EventService.apiPath}/${eventId}`
    )
    .pipe(
      map(
        loadEventDto => 
        EventConverter.fromDtoToModel(loadEventDto)
      )
    );
  }

  public create(event: Event): Observable<Event> {
    const editEventDto: EditEventDto = EventConverter.fromModelToDto(event);
    const body: string = JSON.stringify(editEventDto);

    return this.apiHttp.post<LoadEventDto>(
      `${environment.apiUrl}${EventService.apiPath}`,
      body
    )
    .pipe(
      map(loadEventDto => 
          EventConverter.fromDtoToModel(loadEventDto)
      )
    );
  }

  public update(event: Event): Observable<Event> {
    const editEventDto: EditEventDto = EventConverter.fromModelToDto(event);
    const body: string = JSON.stringify(editEventDto);

    return this.apiHttp.put<LoadEventDto>(
      `${environment.apiUrl}${EventService.apiPath}/${event.id}`,
      body
    )
    .pipe(
      map(loadEventDto => 
        EventConverter.fromDtoToModel(loadEventDto)
      )
    );
  }

  public delete(eventId: number): Observable<void> {
    return this.apiHttp.delete<void>(
      `${environment.apiUrl}${EventService.apiPath}/${eventId}`
    );
  }
}