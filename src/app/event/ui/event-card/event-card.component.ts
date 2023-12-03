import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../../event/model/event.model';
import { DateHelper } from '../../../common/date/helper/date.helper';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-card.component.html',
  styleUrls: ['event-card.component.scss']
})
export class EventCardComponent {
  @Input() public event: Event = new Event();

  public get durationLabel(): string {
    const startingDateStr: string = DateHelper.getUTCStr(this.event.startingDateTime);
    const endingDateStr: string = DateHelper.getUTCStr(this.event.endingDateTime);
    const startingTimeStr: string = DateHelper.getUTCHoursAndMinutesStr(this.event.startingDateTime);
    const endingTimeStr: string = DateHelper.getUTCHoursAndMinutesStr(this.event.endingDateTime);

    if (this.event.allDay) {
      if (!DateHelper.areUTCDatesEqual(
        this.event.startingDateTime, this.event.endingDateTime
      )) {
        return `${startingDateStr} - ${endingDateStr}`;
      }

      return '';
    }

    if (DateHelper.areUTCDatesEqual(
      this.event.startingDateTime, this.event.endingDateTime
    )) {
      return `${startingTimeStr} - ${endingTimeStr}`;
    }

    return `${startingDateStr} ${startingTimeStr} - ${endingDateStr} ${endingTimeStr}`;
  }
}
