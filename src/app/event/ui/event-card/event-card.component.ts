import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from 'src/app/event/model/event.model';
import * as moment from 'moment';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-card.component.html',
  styleUrls: ['event-card.component.scss']
})
export class EventCardComponent {
  @Input() public event: Event = new Event();

  public get dates(): string {
    const startingDateStr: string = moment(this.event.startingDateTime).format('HH:mm');
    const endingDateStr: string = moment(this.event.endingDateTime).format('HH:mm');
    return `${startingDateStr} - ${endingDateStr}`;
  }
}
