import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileTopBarComponent } from "../../../common/top-bar/profile/ui/profile-top-bar.component";
import { InlineCalendarComponent } from "../../../common/calendar/ui/inline-calendar/inline-calendar.component";
import { TabBarComponent } from "../../../common/tab-bar/ui/tab-bar/tab-bar.component";
import { EventRoutes } from '../../route/event.routes';
import { Router } from '@angular/router';
import { Action } from 'src/app/common/action';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import * as moment from 'moment';
import { EventService } from '../../service/event.service';
import { SimpleLoadingComponent } from "../../../common/loading/ui/simple-loading/simple-loading.component";
import { EventLargeEmptyComponent } from "../event-large-empty/event-large-empty.component";

@Component({
    selector: 'app-display-events',
    standalone: true,
    templateUrl: './display-events.component.html',
    styleUrls: ['display-events.component.scss'],
    imports: [CommonModule, ProfileTopBarComponent, InlineCalendarComponent, TabBarComponent, SimpleLoadingComponent, EventLargeEmptyComponent]
})
export class DisplayEventsComponent {
  private selectedDateSubject: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  private selectedDate$: Observable<Date> = this.selectedDateSubject.asObservable();

  public events$ 
  = this.selectedDate$
  .pipe(
    switchMap(date => this.eventService.loadAllByDate(date))
  );

  public constructor(
    private router: Router,
    private eventService: EventService
  ) { }

  public goToCreate(): Promise<boolean> {
    return this.router.navigate([EventRoutes.editEventRoute],
      { 
        queryParams: { 
          action: Action.create,
          defaultDate: moment(this.selectedDateSubject.value).format("YYYY-MM-DD") 
        } 
      });
  }
}
