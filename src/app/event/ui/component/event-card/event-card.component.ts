import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Event} from '../../../../event/model/event.model';
import {DateHelper} from '../../../../common/date/helper/date.helper';
import {MatCardModule} from '@angular/material/card';
import {EventDeleteButtonComponent} from "../../component/event-delete-button/event-delete-button.component";
import {EventEditButtonComponent} from "../../component/event-edit-button/event-edit-button.component";

@Component({
    selector: 'app-event-card',
    standalone: true,
    imports: [
        MatCardModule,
        EventDeleteButtonComponent,
        EventEditButtonComponent
    ],
    templateUrl: './event-card.component.html',
    styleUrl: '../common/event-card.component.scss'
})
export class EventCardComponent {
    @Input() public event: Event|undefined;
    @Input() public showActions: boolean = true;
    @Output() public onEventDeleted: EventEmitter<Event> = new EventEmitter<Event>();

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

    public eventDeleted(deletedEvent: Event) {
        this.onEventDeleted.emit(deletedEvent);
    }
}
