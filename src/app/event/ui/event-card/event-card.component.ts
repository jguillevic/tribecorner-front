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
  @Input() public event: Event|undefined;

  public get durationLabel(): string {
    if (this.event) {
      const startingDateStr: string = DateHelper.toDate(this.event.startingDateTime);
      const endingDateStr: string = DateHelper.toDate(this.event.endingDateTime);
      const startingTimeStr: string = DateHelper.toHoursAndMinutes(this.event.startingDateTime);
      const endingTimeStr: string = DateHelper.toHoursAndMinutes(this.event.endingDateTime);

      if (this.event.allDay) {
        if (!DateHelper.areDatesEqual(
          this.event.startingDateTime, this.event.endingDateTime
        )) {
          return `${startingDateStr} - ${endingDateStr}`;
        }

        return '';
      }

      if (DateHelper.areDatesEqual(
        this.event.startingDateTime, this.event.endingDateTime
      )) {
        return `${startingTimeStr} - ${endingTimeStr}`;
      }

      return `${startingDateStr} ${startingTimeStr} - ${endingDateStr} ${endingTimeStr}`;
    }
    return '';
  }
}
