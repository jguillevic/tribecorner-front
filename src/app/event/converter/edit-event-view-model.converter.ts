import { EditEventViewModel } from "../view-model/edit-event.view-model";
import { Event } from "../model/event.model";
import { DateHelper } from "../../common/date/helper/date.helper";

export abstract class EditEventViewModelConverter {
    public static fromModelToViewModel(event: Event): EditEventViewModel {
        return new EditEventViewModel(
            event.id,
            event.name,
            DateHelper.getInvariantDateWithoutTimeZone(event.startingDateTime),
            event.startingDateTime.getHours() * 60 + event.startingDateTime.getMinutes(),
            DateHelper.getInvariantDateWithoutTimeZone(event.endingDateTime),
            event.endingDateTime.getHours() * 60 + event.endingDateTime.getMinutes(),
            event.allDay
          );
    }

    public static fromViewModelToModel(editEventViewModel: EditEventViewModel) {
        const startingDateTime: Date 
        = EditEventViewModelConverter.convertToDateTime(
            editEventViewModel.startingDate,
            editEventViewModel.startingTime
        );
        const endingDateTime: Date 
        = EditEventViewModelConverter.convertToDateTime(
            editEventViewModel.endingDate,
            editEventViewModel.endingTime
        );

        return new Event(
            editEventViewModel.id,
            editEventViewModel.name,
            startingDateTime,
            endingDateTime,
            editEventViewModel.allDay
        );
    }

    public static convertToDateTime(date: Date, time: number): Date {
        const hours: number = Math.floor(time / 60);
        const minutes: number = time % 60;
        
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hours,
            minutes,
            0
        );
    }
}