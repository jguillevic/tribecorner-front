import { EditEventViewModel } from "../view-model/edit-event.view-model";
import { Event } from "../model/event.model";
import { DateHelper } from "../../common/date/helper/date.helper";

export abstract class EditEventViewModelConverter {
    public static fromModelToViewModel(event: Event): EditEventViewModel {
        const editEventViewModel = new EditEventViewModel(
            event.id,
            event.name,
            DateHelper.getUTCDate(event.startingDateTime),
            event.startingDateTime.getUTCHours() * 60 + event.startingDateTime.getUTCMinutes(),
            DateHelper.getUTCDate(event.endingDateTime),
            event.endingDateTime.getUTCHours() * 60 + event.endingDateTime.getUTCMinutes(),
            event.allDay
        );
        return editEventViewModel;
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

        const event: Event = new Event(
            editEventViewModel.id,
            editEventViewModel.name,
            startingDateTime,
            endingDateTime,
            editEventViewModel.allDay
        );

        return event;
    }

    public static convertToDateTime(date: Date, time: number): Date {
        const hours: number = Math.floor(time / 60);
        const minutes: number = time % 60;
        
        return new Date(
            Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                hours,
                minutes,
                0
            )
        );
    }
}