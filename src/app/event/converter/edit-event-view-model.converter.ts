import { EditEventViewModel } from "../view-model/edit-event.view-model";
import { Event } from "../model/event.model";
import { DateHelper } from "../../common/date/helper/date.helper";

export abstract class EditEventViewModelConverter {
    public static fromModelToViewModel(event: Event): EditEventViewModel {
        return new EditEventViewModel(
            event.id,
            event.name,
            DateHelper.getInvariantDate(event.startingDateTime),
            event.startingDateTime.getUTCHours() * 60 + event.startingDateTime.getUTCMinutes(),
            DateHelper.getInvariantDate(event.endingDateTime),
            event.endingDateTime.getUTCHours() * 60 + event.endingDateTime.getUTCMinutes(),
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
            Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                hours,
                minutes,
                0
            )
        );
    }
}