import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileTopBarComponent } from "../../../common/top-bar/profile/ui/profile-top-bar.component";
import { InlineCalendarComponent } from "../../../common/calendar/ui/inline-calendar/inline-calendar.component";
import { TabBarComponent } from "../../../common/tab-bar/ui/tab-bar/tab-bar.component";
import { EventRoutes } from '../../route/event.routes';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, map, switchMap, take, tap } from 'rxjs';
import { EventService } from '../../service/event.service';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { EventLargeEmptyComponent } from "../event-large-empty/event-large-empty.component";
import { EventCardComponent } from "../event-card/event-card.component";
import { EventCurrentDateService } from '../../service/event-current-date.service';
import { Event } from '../../model/event.model';
import { EventDeleteButtonComponent } from "../event-delete-button/event-delete-button.component";

@Component({
    selector: 'app-display-events',
    standalone: true,
    templateUrl: './display-events.component.html',
    styleUrls: ['display-events.component.scss'],
    imports: [
        CommonModule,
        ProfileTopBarComponent,
        InlineCalendarComponent,
        TabBarComponent,
        SimpleLoadingComponent,
        EventLargeEmptyComponent,
        EventCardComponent,
        EventDeleteButtonComponent
    ]
})
export class DisplayEventsComponent {
  private readonly selectedDate$: Observable<Date> = this.eventCurrentDateService.currentDate$;
  public readonly defaultDate$: Observable<Date> = this.selectedDate$
  .pipe(
    take(1)
  );

  private readonly deletedEventsSubject: BehaviorSubject<Event[]> = new BehaviorSubject<Event[]>([]);
  private readonly deletedEvents$: Observable<Event[]> = this.deletedEventsSubject.asObservable();

  public readonly events$ 
  = combineLatest(
    {
      loadedEvents: this.selectedDate$.pipe(
        switchMap(date => this.eventService.loadAllByDate(date))
      ),
      deletedEvents: this.deletedEvents$
    }
  )
  .pipe(
    map(result => 
      result.loadedEvents.filter(
        loadedEvent => !result.deletedEvents.includes(loadedEvent)
      )
    )
  );

  public constructor(
    private router: Router,
    private eventService: EventService,
    private eventCurrentDateService: EventCurrentDateService
  ) { }

  public goToCreate(): Promise<boolean> {
    return this.router.navigate([EventRoutes.editEventRoute]);
  }

  public onSelectedDateChanged(date: Date) {
    this.eventCurrentDateService.selectDate(date);
  }

  public onEventDeleted(deletedEvent: Event) {
    this.deletedEventsSubject.next(
      [
        ...this.deletedEventsSubject.value,
        deletedEvent
      ]
    );
  }
}
